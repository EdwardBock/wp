import type {UserHasPublishedPostsQuery, UserIdsQuery, UserRolesQuery} from "../types";
import {isNumberArray, isStringArray} from "./base.ts";

export const isUserRolesQuery = (data: any): data is UserRolesQuery => {
    return typeof data?.is == "string" && ["in", "not_in"].includes(data.is)
        && isStringArray(data?.values);
}

export const isUserIdsQuery = (data: any): data is UserIdsQuery => {
    return typeof data?.type == "string" && ["include", "exclude"].includes(data.type)
        && isNumberArray(data?.values);
}

export const isUserHasPublishedPostsQuery = (data: any): data is UserHasPublishedPostsQuery => {
    return isStringArray(data?.postTypes);
}