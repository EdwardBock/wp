import {WordPress} from "../instance.ts";
import {and, eq, inArray, like} from "drizzle-orm";

export const whereUserHasRole = (
    wp: WordPress,
    role: string
) => {
    const {
        db,
        users,
        userMeta,
    } = wp;


    const userIds = db.select({id: userMeta.userId})
        .from(userMeta)
        .where(
            and(
                eq(userMeta.key, `${wp.prefix}capabilities`),
                like(userMeta.value, `%"${role}"%`)
            )
        );

    return inArray(users.id, userIds);
}
