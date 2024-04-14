import type {WordPress} from "../instance.ts";
import {asc, desc, eq} from "drizzle-orm";
import {pagination} from "../utils";
import {hydrateTermsWithMeta} from "../hydration";
import {TaxonomyQueryArgs} from "../types";
import {whereTerms} from "../where";

export async function queryTerms(
    wp: WordPress,
    args: TaxonomyQueryArgs = {},
) {


    const {
        taxonomy="category",
        terms,
        orderBy= wp.terms.name,
        orderDirection,
    } = args;

    const paged = pagination(args);

    const result = await wp.db
        .select()
        .from(wp.terms)
        .leftJoin(wp.termTaxonomy, eq(wp.terms.id, wp.termTaxonomy.termId))
        .where(whereTerms(wp, taxonomy, terms))
        .orderBy((orderDirection == "desc" ? desc : asc)(orderBy))
        .limit(paged.limit)
        .offset(paged.offset);

    const mapped = result.map((row)=> {
        const term = row[`${wp.prefix}terms`]!;
        return {
            ...term,
            count: row[`${wp.prefix}term_taxonomy`]?.count ?? 0,
            parent: row[`${wp.prefix}term_taxonomy`]?.parent ?? 0,
        }
    })

    return hydrateTermsWithMeta(wp, mapped);
}
