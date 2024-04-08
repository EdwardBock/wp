import {WordPress} from "../instance.ts";
import {UsersArgs} from "../types";
import {and, inArray, SQL} from "drizzle-orm";
import {pagination} from "../utils";
import {hydrateUsersWithMeta, hydrateUserWithMeta} from "../hydration";
import {isNumberArray, isStringArray} from "../typeguards";
import {isUserRolesQuery} from "../typeguards";

export async function queryUsers(
    wp: WordPress,
    args: UsersArgs
){

    const where: SQL[] = [];

    if(isStringArray(args.roles)){

    } else if (isUserRolesQuery(args.roles)){

    }

    if(isNumberArray(args.ids)){
        where.push(inArray(wp.users.id, args.ids));
    }

    const paged = pagination(args);

    const result = await wp.db
        .select()
        .from(wp.users)
        .where(and(...where))
        .limit(paged.limit)
        .offset(paged.offset);

    return hydrateUsersWithMeta(
        wp,
        result
    );
}

export async function getUserMeta(wp: WordPress, userId: number, metaKey: string){
    return getUserMetas(wp, userId).then(map => map.get(metaKey) ?? null);
}

export async function getUserMetas(wp: WordPress, userId: number){
    return hydrateUserWithMeta(wp, {id:userId}).then(user => user.metas);
}