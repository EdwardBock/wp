import {int, longtext, mysqlTable, varchar} from "drizzle-orm/mysql-core";

export const terms = (prefix: string) => mysqlTable(
    `${prefix}terms`,
    {
        id: int("term_id", {unsigned: true}).notNull(),
        name: varchar("name", {length: 200}).notNull(),
        slug: varchar("slug", {length: 200}).notNull(),
        group: int("term_group", {unsigned: true}).notNull(),
    }
);

export const termMeta = (prefix: string) => mysqlTable(
    `${prefix}termmeta`,
    {
        id: int("meta_id", {unsigned: true}).notNull(),
        termId: int("term_id", {unsigned: true}).notNull().references(() => terms(prefix).id),
        key: varchar("meta_key", {length: 255}),
        value: longtext("meta_value"),
    }
);

export const termTaxonomy = (prefix: string) => mysqlTable(
    `${prefix}term_taxonomy`,
    {
        termTaxonomyId: int("term_taxonomy_id", {unsigned: true}).notNull(),
        termId: int("term_id", {unsigned: true}).notNull().references(() => terms(prefix).id),
        taxonomy: varchar("taxonomy", {length: 32}).notNull(),
        description: longtext("description").notNull(),
        parent: int("parent", {unsigned: true}).notNull(),
        count: int("count", {unsigned: true}).notNull(),
    }
);

export const termRelationships = (prefix: string) => mysqlTable(
    `${prefix}term_relationships`,
    {
        objectId: int("object_id", {unsigned: true}).notNull(),
        termTaxonomyId: int("term_taxonomy_id", {unsigned: true}).notNull()
            .references(() => termTaxonomy(prefix).termTaxonomyId),
        order: int("term_order").notNull(),
    }
);