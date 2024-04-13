import mysql from "mysql2/promise";
import connect from "./src";

export const getWP = () => {
    const pool = mysql.createPool({
        host: "127.0.0.1",
        user: "exampleuser",
        database: "exampledb",
        password: "examplepass",
    });
    return connect({
        db: {
            client: pool,
            prefix: "wp_"
        }
    });
}