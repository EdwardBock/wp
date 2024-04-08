import {eq} from "drizzle-orm";
import {WordPress} from "../instance.ts";

export async function getOption(wp: WordPress, name: string){
    const results = await wp.db.select().from(wp.options)
        .where(eq(wp.options.name, name));

    return results[0] ?? null;
}