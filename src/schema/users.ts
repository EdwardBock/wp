import {datetime, int, longtext, mysqlTable, varchar} from "drizzle-orm/mysql-core";

export const users = (prefix: string) => mysqlTable(
    `${prefix}users`,
    {
        id: int("ID", {unsigned: true}).notNull(),
        login: varchar("user_login", {length: 60}).notNull(),
        pass: varchar("user_pass", {length: 255}).notNull(),
        nicename: varchar("user_nicename", {length: 50}).notNull(),
        email: varchar("user_email", {length: 100}).notNull(),
        url: varchar("user_url", {length: 100}).notNull(),
        registered: datetime("user_registered").notNull(),
        activationKey: varchar("user_activation_key", {length: 255}).notNull(),
        status: int("user_status", {unsigned: true}).notNull(),
        displayname: varchar("display_name", {length: 250}).notNull(),
    }
);

export const userMeta = (prefix: string) => mysqlTable(
    `${prefix}usermeta`,
    {
        id: int("umeta_id", {unsigned: true}).notNull(),
        userId: int('user_id', {unsigned: true}).notNull().references(() => users(prefix).id),
        key: varchar("meta_key", {length: 255}),
        value: longtext("meta_value"),
    }
);