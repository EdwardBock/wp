import {MySqlColumn} from "drizzle-orm/mysql-core";
import {OrderDirection} from "./base.ts";
import {TermQuery} from "./taxonomy.ts";

export type PostStatus =  "publish" | "pending" | "draft" | "auto-draft" | "future" | "private" | "inherit" | "trash"
export type PostStatusArgs = "any" | PostStatus | PostStatus[]

export type PostType = "any" | string[]

export type TaxonomyQuery = {
    [taxonomy: string]: TermQuery
}

export type AuthorInIds = { inIds: number[] }
export type AuthorNotInIds = { notInIds: number[] }
export type AuthorName = { name: string }
export type AuthorEmail = { email: string }
export type AuthorArgs = AuthorInIds | AuthorNotInIds | AuthorName

export type PostsQueryArgs = {
    include?: number[],
    postType?: PostType
    perPage?: number
    page?: number
    terms?: TaxonomyQuery
    postStatus?: PostStatusArgs
    author?: AuthorArgs
    orderBy?: MySqlColumn
    orderDirection?: OrderDirection
}