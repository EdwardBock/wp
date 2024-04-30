import {WordPress} from "../instance.ts";
import {and, eq, inArray} from "drizzle-orm";
import {wherePostTerms} from "../where";
import {hydratePosts} from "../hydration";
import {Hierarchy, MenuItem} from "../types";
import {buildHierarchy} from "../utils";

export const getMenu = async (wp: WordPress, slug: string) => {
    const menus = await getMenus(wp)
    return menus.get(slug) ?? null;
}

export const getMenus = async (wp: WordPress) => {

    const result = await wp.db.select().from(wp.posts).where(
        and(
            eq(wp.posts.type, "nav_menu_item"),
            wherePostTerms(wp, "nav_menu"),
        ),
    ).orderBy(wp.posts.menuOrder);

    const posts = await hydratePosts(wp, result);

    const reducedMenuItems: (MenuItem & {menu: string})[] = posts.map((item) => {
        const type = String(item.metas.get("_menu_item_type"));
        const menu = item.terms.get("nav_menu")?.[0]?.slug ?? "--unknown--";
        if(type == "post_type"){
            return {
                menu,
                id: item.id,
                parent: parseInt(String(item.metas.get("_menu_item_menu_item_parent"))),
                type: "post_type",
                title: item.title,
                postType: String(item.metas.get("_menu_item_object")),
                postId: parseInt(String(item.metas.get("_menu_item_object_id"))),
            }
        }
        if(type == "taxonomy"){
            return {
                menu,
                id: item.id,
                parent: parseInt(String(item.metas.get("_menu_item_menu_item_parent"))),
                type: "taxonomy",
                title: item.title,
                taxonomy: String(item.metas.get("_menu_item_object")),
                termId: parseInt(String(item.metas.get("_menu_item_object_id"))),
            }
        }

        return {
            menu,
            id: item.id,
            parent: parseInt(String(item.metas.get("_menu_item_menu_item_parent"))),
            type: "custom",
            title: item.title,
            url: String(item.metas.get("_menu_item_url") ?? ""),
        }
    });

    const hydrated = await hydrateMenuItems(wp, reducedMenuItems);

    const menuMap = new Map<string, MenuItem[]>();

    hydrated.forEach((item) => {
        const clonedItem: MenuItem = structuredClone(item);
        menuMap.set(item.menu, [
            ...(menuMap.get(item.menu) ?? []),
            clonedItem,
        ]);
    });

    const hierarchyMap = new Map<string, Hierarchy<MenuItem>[]>();
    menuMap.forEach((items, key)=> {
        const hierarchy = buildHierarchy(
            items,
            (item) => item.id,
            (item) => item.parent,
        );
        hierarchyMap.set(key, hierarchy);
    });

    return hierarchyMap;
}

async function hydrateMenuItems<T extends MenuItem>(wp: WordPress, items: T[]){
    const termIds = items.map(item => {
        if(item.type != "taxonomy") return null;
        return item.termId;
    }).filter(id => id != null);

    const terms = await wp.db
        .select({
            id: wp.terms.id,
            slug: wp.terms.slug,
            name: wp.terms.name,
        })
        .from(wp.terms)
        .where(inArray(wp.terms.id, termIds as number[]));

    const postIds = items.map(item => {
        if(item.type != "post_type") return null;
        return item.postId;
    }).filter(id => id !=  null);

    const posts = await wp.db
        .select({
            id: wp.posts.id,
            name: wp.posts.name,
            title: wp.posts.title,
        })
        .from(wp.posts)
        .where(inArray(wp.posts.id, postIds as number[]));

    return items.map(item => {
        if(item.type == "taxonomy"){
            const term = terms.find(t => t.id == item.termId);
            return {
                ...item,
                slug: term?.slug ?? "",
                title: item.title ? item.title : term?.name ?? "",
            }
        }
        if( item.type == "post_type"){
            const post = posts.find(p => p.id == item.postId);
            return {
                ...item,
                title: item.title ? item.title : post?.title ?? "",
                name: post?.name ?? "",
            }
        }
        return item;
    })
}