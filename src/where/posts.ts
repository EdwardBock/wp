import type {AuthorArgs, PostStatus, PostStatusArgs, PostType, TaxonomyQueryArgs, WordPress} from "../index.ts";
import {and, inArray} from "drizzle-orm";
import {wherePostTerms} from "./terms.ts";
import {wherePostWithAuthor} from "./authors.ts";

export function wherePost(
    wp: WordPress,
    args: {
        postType?: PostType
        terms?: TaxonomyQueryArgs
        postStatus?: PostStatusArgs
        author?: AuthorArgs
    }
) {

    const {
        postType = ["post"],
        terms = {},
        postStatus = "publish",
        author,
    } = args;

    // ------------------------------------
    // post type
    // ------------------------------------
    const postTypeWhere = wherePostWithPostType(wp, postType);

    // ------------------------------------
    // terms
    // ------------------------------------
    const termsWhere = Object.entries(terms).map(([taxonomy, query]) => {
        return wherePostTerms(wp, taxonomy, query)
    });

    // ------------------------------------
    // post status
    // ------------------------------------
    const postStatusWhere = postStatus == "any" ? undefined : wherePostWithStatus(wp, postStatus);

    // ------------------------------------
    // author
    // ------------------------------------
    let authorWhere = author ? wherePostWithAuthor(wp, author) : undefined;

    return and(
        postTypeWhere,
        postStatusWhere,
        authorWhere,
        ...termsWhere,
    );
}

export function wherePostWithPostType(
    wp: WordPress,
    types: PostType
) {
    return types == "any" ? undefined : inArray(wp.posts.type, types);
}

export function wherePostWithStatus(
    wp: WordPress,
    status: PostStatus | PostStatus[]
) {
    return inArray(wp.posts.status, Array.isArray(status) ? status : [status]);
}