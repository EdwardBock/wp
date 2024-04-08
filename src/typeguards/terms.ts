import {TermIdQuery, TermIdQueryConfig, TermSlugQuery, TermSlugQueryConfig} from "../types";
import {isRelation} from "./base.ts";

export const isTermSlugQuery = (data: any): data is TermSlugQuery => {
    if (!Array.isArray(data)) return false;
    return (data.filter((i: any) => typeof i == "string").length == data.length);
}

export const isTermIdQuery = (data: any): data is TermIdQuery => {
    if (!Array.isArray(data)) return false;
    return (data.filter((i: any) => typeof i == "number").length == data.length);
}

export const isTermSlugQueryConfig = (data: any): data is TermSlugQueryConfig => {
    if(!isTermSlugQuery(data?.value)) return false;
    return (typeof data.relation != "undefined" && !isRelation(data.relation));
}
export const isTermIdQueryConfig = (data: any): data is TermIdQueryConfig => {
    if (!isTermIdQuery(data?.value)) return false;
    return (typeof data.relation != "undefined" && !isRelation(data.relation));
}
