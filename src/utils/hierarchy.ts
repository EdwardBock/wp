import {Hierarchy} from "../types";

export function buildHierarchy<T>(
    items: T[],
    getId: (item: T) => number,
    getParentId: ( item:T ) => false | number
): Hierarchy<T>[] {

    if (items.length === 0) return [];

    const childrenMap: { [parentId: number]: T[] } = {};

    items.forEach(item => {
        const parentId = getParentId(item);
        if (parentId === false) {
            return;
        }

        if (!Array.isArray(childrenMap[parentId])) {
            childrenMap[parentId] = [];
        }
        childrenMap[parentId]!.push({...item});
    });

    return recursiveHierarchy(items, childrenMap, getId).filter(item => {
        const parentId = getParentId(item.item);
        return parentId == 0 || parentId == false;
    });
}

const recursiveHierarchy = <T>(
    items: T[],
    childrenMap: { [parentId: number]: T[] },
    getId: (item: T) => number
): Hierarchy<T>[] => {
    return items.map(item => {
        const id = getId(item);
        const children = childrenMap[id]
        return {
            item,
            children: children ?
                recursiveHierarchy(children, childrenMap, getId)
                :
                []
        }
    })
}