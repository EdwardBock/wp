import {Pagination} from "./base.ts";

export type UserRolesQuery = {
    is: "in" | "not_in"
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