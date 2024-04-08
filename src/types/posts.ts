import {MySqlColumn} from "drizzle-orm/mysql-core";
import {OrderDirection, Relation} from "./base.ts";

export type PostStatus =  "publish" | "pending" | "draft" | "auto-draft" | "future" | "private" | "inherit" | "trash"
export type PostStatusArgs = "any" | PostStatus | PostStatus[]

export type PostType = "any" | string[]

export type TermQueryConfig<T> = {
    value: T
    relation?: Relation
}

export type TermSlugQuery = string[]
export type TermIdQuery =  number[]
export type TermSlugQueryConfig = TermQueryConfig<TermSlugQuery>
export type TermIdQueryConfig = TermQueryConfig<TermIdQuery>

export type TermQuery = TermSlugQuery | TermIdQuery | TermSlugQueryConfig | TermIdQueryConfig

export type TaxonomyQueryArgs = {
    [taxonomy: string]: TermQuery
}

export type AuthorInIds = { inIds: number[] }
export type AuthorNotInIds = { notInIds: number[] }
export type AuthorName = { name: string }
export type AuthorEmail = { email: string }
export type AuthorArgs = AuthorInIds | AuthorNotInIds | AuthorName

export type PostsQueryArgs = {
    postType?: PostType
    perPage?: number
    page?: number
    terms?: TaxonomyQueryArgs
    postStatus?: PostStatusArgs
    author?: AuthorArgs
    orderBy?: MySqlColumn
    orderDirection?: OrderDirection
}