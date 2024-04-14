import {WordPress} from "../instance.ts";
import {and, eq} from "drizzle-orm";
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

    const hydrated = await hydratePosts(wp, result);

    const menuMap = new Map<string, MenuItem[]>();

    hydrated.forEach(item => {
        const type = String(item.metas.get("_menu_item_type"));
        const menu = item.terms.get("nav_menu")?.[0]?.slug ?? "--unknown--";
        let menuItem: MenuItem
        if(type == "post_type"){
            menuItem = {
                id: item.id,
                parent: parseInt(String(item.metas.get("_menu_item_menu_item_parent"))),
                type: "post_type",
                title: item.title,
                postType: String(item.metas.get("_menu_item_object")),
                postId: parseInt(String(item.metas.get("_menu_item_object_id"))),
            }
        } else if(type == "taxonomy"){
            menuItem = {
                id: item.id,
                parent: parseInt(String(item.metas.get("_menu_item_menu_item_parent"))),
                type: "taxonomy",
                title: item.title,
                taxonomy: String(item.metas.get("_menu_item_object")),
                termId: parseInt(String(item.metas.get("_menu_item_object_id"))),
            }
        } else {
            menuItem = {
                id: item.id,
                parent: parseInt(String(item.metas.get("_menu_item_menu_item_parent"))),
                type: "custom",
                title: item.title,
                url: String(item.metas.get("_menu_item_url") ?? ""),
            }
        }

        menuMap.set(menu, [
            ...(menuMap.get(menu) ?? []),
            menuItem,
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

