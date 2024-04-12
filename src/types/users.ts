import {Pagination} from "./base.ts";

export type UserRolesQuery = {
    type: "include" | "exclude"
    values: string[]
}

export type UserIdsQuery = {
    type: "include" | "exclude"
    values: number[]
}

export type UserSearchQuery = {
    value: string
    columns: ("login" | "nicename" | "email" | "url")[]
}

export type UserHasPublishedPostsQuery = {
    postTypes: string[]
}

export type UsersArgs = Pagination & {
    roles?: string[] | UserRolesQuery
    ids?: number[] | UserIdsQuery
    search?: string | UserSearchQuery
    hasPublishedPosts?: true | UserHasPublishedPostsQuery
}