import {WordPress} from "../instance.ts";
import {CommentsQueryArgs} from "../types";
import {and, eq, SQL} from "drizzle-orm";
import {pagination} from "../utils";
import {hydrateCommentsWithMeta} from "../hydration";
import {isCommentStatus} from "../typeguards";

export async function queryComments(
    wp: WordPress,
    args: CommentsQueryArgs
) {

    const where: SQL[] = [];

    if (typeof args.postId == "number") {
        where.push(eq(wp.comments.postId, args.postId));
    }

    if (typeof args.author == "number") {
        where.push(eq(wp.comments.userId, args.author));
    } else if (typeof args.author == "string") {
        where.push(eq(wp.comments.author, args.author));
    }

    if (isCommentStatus(args.status)) {
        where.push(eq(wp.comments.approved, args.status));
    }

    if (typeof args.parent == "number") {
        where.push(eq(wp.comments.parent, args.parent));
    }

    const paged = pagination(args);

    const result = await wp.db
        .select()
        .from(wp.comments)
        .where(and(...where))
        .limit(paged.limit)
        .offset(paged.offset);

    return hydrateCommentsWithMeta(
        wp,
        result
    );
}