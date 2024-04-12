import type {WordPress} from "../instance.ts";
import {and, inArray, isNotNull} from "drizzle-orm";
import {toMetaMap} from "../utils";

type CommentShape = { id: number }

export async function hydrateCommentWithMeta<T extends CommentShape>(
    wp: WordPress,
    comment: T
) {
    const result = await hydrateCommentsWithMeta(wp, [comment]);
    return result[0]!;
}

export async function hydrateCommentsWithMeta<T extends CommentShape>(
    wp: WordPress,
    comments: T[],
) {

    if(comments.length == 0){
        return comments.map(i => ({...i, metas: toMetaMap([])}));
    }

    const ids = comments.map(p => p.id);
    const metas = await wp.db.select()
        .from(wp.commentMeta)
        .where(
            and(
                inArray(wp.commentMeta.commentId, ids),
                isNotNull(wp.commentMeta.key),
                isNotNull(wp.commentMeta.value),
            )
        )
        .orderBy(wp.commentMeta.commentId, wp.commentMeta.key);

    return comments.map(item => {
        return {
            ...item,
            metas: toMetaMap(
                metas
                    .filter(m => m.commentId == item.id)
            ),
        }
    })
}
