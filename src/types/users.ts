import {Pagination} from "./base.ts";

export type UserRolesQuery = {
    type: "include" | "exclude"
    values: string[]
}

export type UserIdsQuery = {
    type: "include" | "exclude"
    values: number[]
}

export type UserHasPublishedPostsQuery = {
    postTypes: string[]
}

export type UserMetaQuery = {
    compare: "exists" | "not exists"
    key: string
} | {
    compare: "eq" | "ne" | "like" | "not like"
    key: string
    value: string
} | {
    compare: "in" | "not in",
    key: string
    values: string[]
}

export type UsersArgs = Pagination & {
    roles?: string[] | UserRolesQuery
    ids?: number[] | UserIdsQuery
    search?: string
    hasPublishedPosts?: true | UserHasPublishedPostsQuery
    meta?: UserMetaQuery
}