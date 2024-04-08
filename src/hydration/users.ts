import type {WordPress} from "../instance.ts";
import {inArray} from "drizzle-orm";
import {toMetaMap} from "../utils";

type UserShape = { id: number }

export async function hydrateUserWithMeta<T extends UserShape>(
    wp: WordPress,
    user: T
) {
    const result = await hydrateUsersWithMeta(wp, [user]);
    return result[0]!;
}

export async function hydrateUsersWithMeta<T extends UserShape>(
    wp: WordPress,
    users: T[],
) {

    const ids = users.map(p => p.id);
    const metas = await wp.db.select()
        .from(wp.userMeta)
        .where(inArray(wp.userMeta.userId, ids))
        .orderBy(wp.userMeta.userId, wp.userMeta.key);

    return users.map(item => {
        return {
            ...item,
            metas: toMetaMap(
                metas
                    .filter(m => m.userId == item.id)
            ),
        }
    })
}
