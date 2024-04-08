import mysql from "mysql2/promise";
import fs from "node:fs";

(async ()=> {

    const connection = await mysql.createConnection({
        host: "127.0.0.1",
        user: "exampleuser",
        database: "exampledb",
        password: "examplepass",
    });


    const seed = fs.readFileSync('./__seed__/seed.sql').toString().split(";\n");
    console.debug("seed")
    for (const q of seed) {
        await connection.query(q);
    }

    connection.destroy();

})();