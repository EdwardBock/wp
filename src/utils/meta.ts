import {MetaMap} from "../types";

export const toMetaMap = (entries:{key:string|null, value: string|null}[]) => {
    const map: MetaMap = new Map();
    entries.forEach(
        (m) => {
            const currentValue = map.get(m.key);
            if (!currentValue) {
                map.set(m.key, m.value);
            } else {
                if (typeof currentValue == "string") {
                    map.set(m.key, [currentValue, m.value]);
                } else {
                    currentValue.push(m.value);
                }
            }
        }
    );
    return map;
}