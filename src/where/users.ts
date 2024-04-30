import type {WordPress} from "../instance.ts";
import type {UserIdsQuery, UserMetaQuery, UserRolesQuery} from "../types";
import {and, eq, ne, inArray, like, notInArray, or, notLike, exists, notExists, SQL} from "drizzle-orm";
import {isNumberArray, isStringArray} from "../typeguards";

export const whereUserIds = (
    wp: WordPress,
    query: UserIdsQuery | number[]
) => {
    if (isNumberArray(query)) {
        query = {
            type: "include",
            values: query,
        } satisfies UserIdsQuery
    }

    const {
        type,
        values,
    } = query

    if (values.length == 0) {
        return undefined;
    }

    const {
        users,
    } = wp;

    const inOrNotIn = type == "include" ? inArray : notInArray;
    return inOrNotIn(users.id, values);

}

export const whereUserInRoles = (
    wp: WordPress,
    query: UserRolesQuery | string[]
) => {

    if (isStringArray(query)) {
        query = {
            type: "include",
            values: query,
        }
    }

    const {
        type,
        values,
    } = query;

    if (query.values.length == 0) return undefined;

    const {
        users,
    } = wp;

    const userIds = selectUserIdsFromCapabilitiesMeta(wp, values);

    const inOrNotIn = type == "include" ? inArray : notInArray;
    return inOrNotIn(users.id, userIds);

}

const selectUserIdsFromCapabilitiesMeta = (wp: WordPress, roles: string[]) => {
    const {
        db,
        userMeta,
    } = wp;
    return db
        .select({id: userMeta.userId})
        .from(userMeta)
        .where(
            or(
                ...roles.map(role => and(
                    eq(userMeta.key, `${wp.prefix}capabilities`),
                    like(userMeta.value, `%"${role}"%`)
                ))
            )
        );
}

export const whereUserSearch = (
    wp: WordPress,
    query: string,
) => {
    return or(
        like(wp.users.email, `%${query}%`),
        like(wp.users.login, `%${query}%`),
        like(wp.users.nicename, `%${query}%`),
        like(wp.users.displayname, `%${query}%`),
    )
}

export const whereUserMetaQuery = (
    wp: WordPress,
    query: UserMetaQuery
) => {

    let condition: SQL|undefined;
    if (query.compare == "eq" || query.compare == "ne") {
        const compare = query.compare == "eq" ? eq : ne;
        condition = and(
            eq(wp.users.id, wp.userMeta.userId),
            eq(wp.userMeta.key, query.key),
            compare(wp.userMeta.value, query.value)
        );
    } else if (query.compare == "like" || query.compare == "not like") {
        const compare = query.compare == "like" ? like : notLike;
        condition = and(
            eq(wp.users.id, wp.userMeta.userId),
            eq(wp.userMeta.key, query.key),
            compare(wp.userMeta.value, query.value)
        );
    } else if (query.compare == "exists" || query.compare == "not exists") {
        const compare = query.compare == "exists" ? exists : notExists;
        const selectMetaKey = wp.db
            .select()
            .from(wp.userMeta)
            .where(
                eq(wp.userMeta.key, query.key)
            );
        condition = compare(selectMetaKey);
    } else if (query.compare == "in" || query.compare == "not in") {
        const compare = query.compare == "in" ? inArray : notInArray;
        condition = and(
            eq(wp.userMeta.key, query.key),
            compare(wp.userMeta.value, query.values),
        )
    }

    const subQuery = wp.db.select({id: wp.userMeta.userId})
        .from(wp.userMeta)
        .where(condition);

    return inArray(wp.users.id, subQuery);
}