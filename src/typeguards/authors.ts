import type {AuthorEmail, AuthorInIds, AuthorName, AuthorNotInIds} from "../types";
import {isNumberArray} from "./base.ts";

export const isAuthorInIds = (data:any): data is AuthorInIds => {
    return isNumberArray(data?.inIds);
}

export const isAuthorNotInIds = (data:any): data is AuthorNotInIds => {
    return isNumberArray(data?.notInIds);
}

export const isAuthorName = (data:any): data is AuthorName => {
    return typeof data?.name === "string";
}

export const isAuthorEmail = (data:any): data is AuthorEmail => {
    return typeof data?.email == "string";
}
