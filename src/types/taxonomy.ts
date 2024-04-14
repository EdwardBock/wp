import {OrderDirection, Pagination, Relation} from "./base.ts";
import {MySqlColumn} from "drizzle-orm/mysql-core";

export type TermQueryConfig<T> = {
    value: T
    relation?: Relation
}

export type TermSlugQuery = string[]
export type TermIdQuery =  number[]
export type TermSlugQueryConfig = TermQueryConfig<TermSlugQuery>
export type TermIdQueryConfig = TermQueryConfig<TermIdQuery>

export type TermQuery = TermSlugQuery | TermIdQuery | TermSlugQueryConfig | TermIdQueryConfig

export type TaxonomyQueryArgs = Pagination & {
    taxonomy?: string
    terms?: TermQuery
    orderBy?: MySqlColumn
    orderDirection?: OrderDirection
}