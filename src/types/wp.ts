import {MySql2Client} from "drizzle-orm/mysql2";

export type WordPressDatabaseOptions = {
    prefix: string
    client: MySql2Client,
}

export type WordPressOptions = {
    db: WordPressDatabaseOptions
}
