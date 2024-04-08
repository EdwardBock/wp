
export type Pagination = {
    page?: number
    perPage?: number
}

export type Relation = "and" | "or"

export type OrderDirection = "asc" | "desc"

export type MetaMap = Map<string|null, null | string | (string|null)[]>