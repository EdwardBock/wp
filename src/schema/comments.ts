import {datetime, int, longtext, mysqlTable, text, tinytext, varchar} from "drizzle-orm/mysql-core";

export const comments = (prefix: string) => mysqlTable(
    `${prefix}comments`,
    {
        id: int("comment_ID", {unsigned: true}).primaryKey().notNull().autoincrement(),
        postId: int("comment_post_ID", {unsigned: true}).notNull(),
        author: tinytext("comment_author").notNull(),
        authorEmail: varchar("comment_author_email", {length: 100}).notNull(),
        authorUrl: varchar("comment_author_url", {length: 200}).notNull(),
        authorIP: varchar("comment_author_IP", {length: 100}).notNull(),
        date: datetime("comment_date").notNull(),
        dateGmt: datetime("comment_date_gmt").notNull(),
        content: text("comment_content").notNull(),
        karma: int("comment_karma").notNull(),
        approved: varchar("comment_approved", {length: 20}).notNull(),
        agent: varchar("comment_agent", {length: 255}).notNull(),
        type: varchar("comment_type", {length: 20}).notNull(),
        parent: int("comment_parent").notNull(),
        userId: int("user_id").notNull(),
    }
);

export const commentMeta = (prefix: string) => mysqlTable(
    `${prefix}commentmeta`,
    {
        id: int("meta_id", {unsigned: true}).primaryKey().notNull().autoincrement(),
        commentId: int('comment_id', {unsigned: true}).notNull()
            .references(() => comments(prefix).id),
        key: varchar("meta_key", {length: 255}),
        value: longtext("meta_value"),
    }
);