import type {WordPress} from "../instance.ts";
import {eq} from "drizzle-orm";

export async function getOption(wp: WordPress, name: string){
    const results = await wp.db.select().from(wp.options)
        .where(eq(wp.options.name, name));

    return results[0] ?? null;
}