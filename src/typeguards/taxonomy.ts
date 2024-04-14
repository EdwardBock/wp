import type {TermIdQuery, TermIdQueryConfig, TermSlugQuery, TermSlugQueryConfig} from "../types";
import {isNumberArray, isRelation, isStringArray} from "./base.ts";

export const isTermSlugQuery = (data: any): data is TermSlugQuery => {
    return isStringArray(data);
}

export const isTermIdQuery = (data: any): data is TermIdQuery => {
    return isNumberArray(data);
}

export const isTermSlugQueryConfig = (data: any): data is TermSlugQueryConfig => {
    if(!isTermSlugQuery(data?.value)) return false;
    return (typeof data.relation != "undefined" && !isRelation(data.relation));
}
export const isTermIdQueryConfig = (data: any): data is TermIdQueryConfig => {
    if (!isTermIdQuery(data?.value)) return false;
    return (typeof data.relation != "undefined" && !isRelation(data.relation));
}
