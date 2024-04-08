import {WordPress} from "../instance.ts";
import {eq, ilike, or} from "drizzle-orm";

export function whereCommentWithPostId(
    wp: WordPress,
    postId: number
){
    return eq(wp.comments.postId, postId);
}

export function whereCommentWithAuthorName(
    wp:WordPress,
    name: string
){
    return eq(wp.comments.author, name);
}

export function whereCommentWithAuthorLike(
    wp: WordPress,
    query: string
){
    return or(
        ilike(wp.comments.author, `%${query}%`),
        ilike(wp.comments.authorEmail, `%${query}%`),
    )
}