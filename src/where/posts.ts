import type {AuthorArgs, PostStatus, PostStatusArgs, PostType, TaxonomyQuery, WordPress} from "../index.ts";
import {and, inArray} from "drizzle-orm";
import {wherePostTerms} from "./taxonomy.ts";
import {wherePostWithAuthor} from "./authors.ts";

export function wherePost(
    wp: WordPress,
    args: {
        include?: number[]
        postType?: PostType
        terms?: TaxonomyQuery
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
    // post ids
    // ------------------------------------
    const idsWhere = (args.include && args.include.length > 0) ? wherePostIdIn(wp, args.include) : undefined;

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
        idsWhere,
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

export function wherePostIdIn(
    wp: WordPress,
    ids: number[]
){
    return inArray(wp.posts.id, ids);
}