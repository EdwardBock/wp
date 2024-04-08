import {int, longtext, mysqlTable, varchar} from "drizzle-orm/mysql-core";

export const options = (prefix: string) => mysqlTable(
    `${prefix}options`,
    {
        id: int("option_id", {unsigned: true}).notNull(),
        name: varchar('option_name', {length: 191}).notNull(),
        value: longtext("option_value").notNull(),
        autoload: varchar("autoload", {length: 20}).notNull(),
    }
);