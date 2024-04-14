import type {WordPress} from "../instance.ts";
import type {TermIdQueryConfig, TermQuery, TermSlugQueryConfig} from "../types";
import {and, eq, inArray} from "drizzle-orm";
import {isTermIdQuery, isTermSlugQuery} from "../typeguards";

export const whereTerms = (
    wp: WordPress,
    taxonomy: string,
    query: TermQuery | null = null,
) => {
    const {
        termTaxonomy,
        terms,
    } = wp;

    const whereQuery = wp.db
        .select({id: terms.id})
        .from(terms)
        .leftJoin(termTaxonomy, eq(terms.id, termTaxonomy.termId))
        .where(
            and(
                eq(termTaxonomy.taxonomy, taxonomy),
                query ? whereTermQuery(wp, query) : undefined,
            )
        );

    return inArray(terms.id, whereQuery);
}

export const wherePostTerms = (
    wpdb: WordPress,
    taxonomy: string,
    query: TermQuery | null = null
) => {

    const {
        posts,
        termRelationships,
        termTaxonomy,
        terms,
    } = wpdb;

    const whereQuery = wpdb.db
        .select({id: termRelationships.objectId})
        .from(posts)
        .leftJoin(termRelationships, eq(posts.id, termRelationships.objectId))
        .leftJoin(termTaxonomy, eq(termRelationships.termTaxonomyId, termTaxonomy.termTaxonomyId))
        .leftJoin(terms, eq(terms.id, termTaxonomy.termId))
        .where(
            and(
                eq(posts.id, termRelationships.objectId),
                eq(termTaxonomy.taxonomy, taxonomy),
                query ? whereTermQuery(wpdb, query) : undefined,
            )
        );

    return inArray(posts.id, whereQuery);
}

export const whereTermQuery = (
    wp: WordPress,
    query: TermQuery,
) => {
    const {
        terms,
    } = wp;

    let termQueryConfig: TermIdQueryConfig | TermSlugQueryConfig
    if (isTermSlugQuery(query)) {
        termQueryConfig = {
            relation: "or",
            value: query,
        };
    } else if (isTermIdQuery(query)) {
        termQueryConfig = {
            relation: "or",
            value: query,
        };
    } else {
        termQueryConfig = query;
    }

    if (termQueryConfig) {
        if (termQueryConfig.relation == "and") {
            const parts = termQueryConfig.value.map(value => {
                    return (typeof value == "string") ? eq(terms.slug, value) : eq(terms.id, value)
                }
            );
            return and(...parts);
        } else {
            return isTermIdQuery(termQueryConfig.value) ?
                inArray(terms.id, termQueryConfig.value)
                :
                inArray(terms.slug, termQueryConfig.value);
        }
    }

    return undefined;
}