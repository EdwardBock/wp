import type {WordPress} from "../instance.ts";
import type {UsersArgs} from "../types";
import {and, type SQL} from "drizzle-orm";
import {pagination} from "../utils";
import {hydrateUsersWithMeta, hydrateUserWithMeta} from "../hydration";
import {whereUserIds, whereUserInRoles} from "../where/users.ts";

export async function queryUsers(
    wp: WordPress,
    args: UsersArgs
) {

    const where: SQL[] = [];

    if (args.roles) {
        const rolesQuery = whereUserInRoles(wp, args.roles);
        if (rolesQuery) where.push(rolesQuery);
    }

    if (args.ids) {
        const idsQuery = whereUserIds(wp, args.ids);
        if (idsQuery) where.push(idsQuery);
    }

    const paged = pagination(args);

    const query = wp.db
        .select()
        .from(wp.users)
        .where(and(...where))
        .limit(paged.limit)
        .offset(paged.offset);

    const result = await query;

    return hydrateUsersWithMeta(
        wp,
        result
    );
}

export async function getUserMeta(wp: WordPress, userId: number, metaKey: string) {
    return getUserMetas(wp, userId).then(map => map.get(metaKey) ?? null);
}

export async function getUserMetas(wp: WordPress, userId: number) {
    return hydrateUserWithMeta(wp, {id: userId}).then(user => user.metas);
}