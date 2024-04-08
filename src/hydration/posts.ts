import {eq, getTableColumns, inArray} from "drizzle-orm";
import type {WordPress} from "../instance.ts";
import {toMetaMap} from "../utils";

type PostShape = { id: number }

type TermsMap = Map<string, Array<{
    id: number
    name: string
    slug: string
    parent: number
    description: string
    count: number
}>>

export async function hydratePost<T extends PostShape>(
    wp: WordPress,
    post: T,
) {
    const withMetas = await hydratePostWithMeta(
        wp,
        post
    );
    return await hydratePostWithTerms(
        wp,
        withMetas
    )
}

export async function hydratePosts<T extends PostShape>(
    wp: WordPress,
    posts: T[],
) {
    const withMetas = await hydratePostsWithMeta(
        wp,
        posts
    );
    return await hydratePostsWithTerms(
        wp,
        withMetas
    )
}

export async function hydratePostWithMeta<T extends PostShape>(
    wp: WordPress,
    post: T
){
    const result = await hydratePostsWithMeta(wp, [post]);
    return result[0]!;
}

export async function hydratePostsWithMeta<T extends PostShape>(
    wp: WordPress,
    posts: T[],
) {

    const ids = posts.map(p => p.id);
    const metas = await wp.db.select()
        .from(wp.postMeta)
        .where(inArray(wp.postMeta.postId, ids))
        .orderBy(wp.postMeta.postId, wp.postMeta.key);

    return posts.map(post => {
        return {
            ...post,
            metas: toMetaMap(
                metas
                    .filter(m => m.postId == post.id)
            ),
        }
    })
}

export async function hydratePostWithTerms<T extends PostShape>(
    wp: WordPress,
    post: T
){
    const result = await hydratePostsWithTerms(wp, [post]);
    return result[0]!;
}

export async function hydratePostsWithTerms<T extends PostShape>(
    wp: WordPress,
    posts: T[],
){
    const ids = posts.map(p => p.id);

    const terms = await wp.db.select({
        ...getTableColumns(wp.terms),
        taxonomy: wp.termTaxonomy.taxonomy,
        postId: wp.termRelationships.objectId,
        description: wp.termTaxonomy.description,
        parent: wp.termTaxonomy.parent,
        count: wp.termTaxonomy.count,
    })
        .from(wp.termRelationships)
        .leftJoin(
            wp.termTaxonomy, eq(wp.termTaxonomy.termTaxonomyId, wp.termRelationships.termTaxonomyId)
        )
        .leftJoin(
            wp.terms, eq(wp.terms.id, wp.termTaxonomy.termId)
        )
        .where(
            inArray(wp.termRelationships.objectId, ids),
        );

    return posts.map(post => {

        const taxonomies: TermsMap = new Map();
        terms.forEach(term => {
            if(
                term.postId == post.id &&
                term.taxonomy != null &&
                term.id != null
            ){
                taxonomies.set(term.taxonomy, [...(taxonomies.get(term.taxonomy)?? []), {
                    id: term.id,
                    slug: term.slug ?? "",
                    name: term.name ?? "",
                    description: term.description ?? "",
                    parent: term.parent ?? 0,
                    count: term.count ?? 0,
                }]);
            }
        })

        return {
            ...post,
            terms: taxonomies,
        }
    });
}