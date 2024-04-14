import type {WordPress} from "../instance.ts";
import {inArray} from "drizzle-orm";
import {toMetaMap} from "../utils";

type TermShape = { id: number }

export async function hydrateTermWithMeta<T extends TermShape>(
    wp: WordPress,
    term: T
){
    const result = await hydrateTermsWithMeta(wp, [term]);
    return result[0]!;
}

export async function hydrateTermsWithMeta<T extends TermShape>(
    wp: WordPress,
    terms: T[],
) {

    if(terms.length == 0) return terms;

    const termIds = terms.map(p => p.id);

    const metas = await wp.db.select()
        .from(wp.termMeta)
        .where(inArray(wp.termMeta.termId, termIds))
        .orderBy(wp.termMeta.termId, wp.termMeta.key);


    return terms.map(term => {
        return {
            ...term,
            metas: toMetaMap(
                metas
                .filter(m => m.termId == term.id)
            ),
        }
    })
}
