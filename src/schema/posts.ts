import {datetime, int, longtext, mysqlTable, text, varchar} from "drizzle-orm/mysql-core";

export const posts = (prefix: string) => mysqlTable(
    `${prefix}posts`,
    {
        id: int("ID", {unsigned: true}).primaryKey().notNull().autoincrement(),
        author: int('post_author', {unsigned: true}).notNull(),
        date: datetime("post_date").notNull(),
        dateGmt: datetime("post_date_gmt").notNull(),
        content: longtext("post_content").notNull(),
        title: text("post_title").notNull(),
        excerpt: text("post_excerpt").notNull(),
        status: varchar("post_status", {length: 20}).notNull(),
        commentStatus: varchar('comment_status', {length: 20}).notNull(),
        pingStatus: varchar('ping_status', {length: 20}).notNull(),
        password: varchar('post_password', {length: 255}).notNull(),
        name: varchar("post_name", {length: 200}).notNull(),
        modified: datetime("post_modified").notNull(),
        modifiedGmt: datetime("post_modified_gmt").notNull(),
        parent: int("post_parent", {unsigned: true}).notNull(),
        guid: varchar("guid", {length: 255}).notNull(),
        type: varchar("post_type", {length: 20}).notNull(),
        commentCount: int("comment_count", {unsigned: true}).notNull(),
    }
);

export const postMeta = (prefix: string) => mysqlTable(
    `${prefix}postmeta`,
    {
        id: int("meta_id", {unsigned: true}).primaryKey().notNull().autoincrement(),
        postId: int('post_id', {unsigned: true}).notNull()
            .references(() => posts(prefix).id),
        key: varchar("meta_key", {length: 255}),
        value: longtext("meta_value"),
    }
);