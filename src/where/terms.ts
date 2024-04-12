import type {WordPress} from "../instance.ts";
import type {TermIdQueryConfig, TermQuery, TermSlugQueryConfig} from "../types";
import {and, eq, inArray, type SQL} from "drizzle-orm";
import {isTermIdQuery, isTermSlugQuery} from "../typeguards";

export const wherePostTerms = (
    wpdb: WordPress,
    taxonomy: string,
    query: TermQuery
) => {

    const {
        posts,
        termRelationships,
        termTaxonomy,
        terms,
    } = wpdb;

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

    let sql: SQL | undefined;
    if (termQueryConfig.relation == "and") {
        const parts = termQueryConfig.value.map(value => {
                return (typeof value == "string") ? eq(terms.slug, value) : eq(terms.id, value)
            }
        );
        sql = and(...parts);
    } else {
        sql = isTermIdQuery(termQueryConfig.value) ?
            inArray(terms.id, termQueryConfig.value)
            :
            inArray(terms.slug, termQueryConfig.value);
    }

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
                sql
            )
        );

    return inArray(posts.id, whereQuery);
}