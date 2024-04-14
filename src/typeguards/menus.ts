import {MenuItemCustom, MenuItemPostType, MenuItemTaxonomy} from "../types";

export const isMenuItemCustom  = (data:any): data is MenuItemCustom => {
    return data?.type == "custom";
}

export const isMenuItemPostType  = (data:any): data is MenuItemPostType => {
    return data?.type == "post_type";
}

export const isMenuItemTaxonomy  = (data:any): data is MenuItemTaxonomy => {
    return data?.type == "taxonomy";
}