import type {WordPress} from "../instance.ts";
import type {UserIdsQuery, UserRolesQuery} from "../types";
import {and, eq, inArray, like, notInArray, or} from "drizzle-orm";
import {isNumberArray, isStringArray} from "../typeguards";

export const whereUserIds = (
    wp: WordPress,
    query: UserIdsQuery | number[]
)=> {
    if(isNumberArray(query)){
        query = {
            type: "include",
            values: query,
        } satisfies UserIdsQuery
    }

    const {
        type,
        values,
    } = query

    if(values.length == 0){
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
    query: UserRolesQuery|string[]
) => {

    if(isStringArray(query)){
        query = {
            type: "include",
            values: query,
        }
    }

    const {
        type,
        values,
    } = query;

    if(query.values.length == 0) return undefined;

    const {
        users,
    } = wp;

    const userIds = selectUserIdsFromCapabilitiesMeta(wp, values);

    const inOrNotIn = type == "include" ? inArray: notInArray;
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