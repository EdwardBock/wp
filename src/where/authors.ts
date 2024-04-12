import type {WordPress} from "../instance.ts";
import type {AuthorArgs} from "../types";
import {eq, inArray, notInArray} from "drizzle-orm";
import {isAuthorEmail, isAuthorInIds, isAuthorNotInIds} from "../typeguards";

export const wherePostWithAuthor = (
    wp: WordPress,
    author: AuthorArgs
) => {

    if (isAuthorInIds(author)) {
        return inArray(wp.posts.author, author.inIds);
    }

    if (isAuthorNotInIds(author)) {
        return notInArray(wp.posts.author, author.notInIds)
    }

    const userTable = wp.db
        .select({id: wp.users.id})
        .from(wp.users)
        .where(
            (isAuthorEmail(author)) ?
                eq(wp.users.email, author.email)
                :
                eq(wp.users.login, author.name)
        );

    return inArray(wp.posts.author, userTable);
}