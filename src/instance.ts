import {drizzle} from "drizzle-orm/mysql2";
import {WordPressOptions} from "./types";
import * as schema from "./schema";

export default function wp(
    options: WordPressOptions,
) {

    const {
        db: {
            client,
            prefix,
        }
    } = options;

    const posts = schema.posts(prefix);
    const postMeta = schema.postMeta(prefix);
    const comments = schema.comments(prefix);
    const commentMeta = schema.commentMeta(prefix);
    const terms = schema.terms(prefix);
    const termMeta = schema.termMeta(prefix);
    const termTaxonomy = schema.termTaxonomy(prefix);
    const termRelationships = schema.termRelationships(prefix);
    const users = schema.users(prefix);
    const userMeta = schema.userMeta(prefix);
    const _options = schema.options(prefix);

    const _schema = {
        posts,
        postMeta,
        comments,
        commentMeta,
        terms,
        termMeta,
        termTaxonomy,
        termRelationships,
        users,
        userMeta,
        options: _options,
    }

    const instance = drizzle(client);

    return {
        prefix,
        db: instance,
        destroy(){
            client.end();
        },
        ..._schema,
    } as const
}

export type WordPress = ReturnType<typeof wp>
