import {AuthorEmail, AuthorInIds, AuthorName, AuthorNotInIds} from "../types";

export const isAuthorInIds = (data:any): data is AuthorInIds => {
    const ids = data?.inIds;
    if(!Array.isArray(ids)) return false;
    return ids.filter((i:any) => typeof i == "number").length == ids.length;
}

export const isAuthorNotInIds = (data:any): data is AuthorNotInIds => {
    const ids = data?.notInIds;
    if(!Array.isArray(ids)) return false;
    return ids.filter((i:any) => typeof i == "number").length == ids.length;
}

export const isAuthorName = (data:any): data is AuthorName => {
    return typeof data?.name === "string";
}

export const isAuthorEmail = (data:any): data is AuthorEmail => {
    return typeof data?.email == "string";
}
