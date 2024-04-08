import {whereCommentWithPostId, hydrateCommentsWithMeta} from "../src";
import {getWP} from "../test-utils";

describe('Comments table', () => {

    const wp = getWP();

    afterAll(()=> {
        wp.destroy();
    });

    it('should have comments', async ()=> {
        const comments = await wp.db
            .select()
            .from(wp.comments);

        expect(comments.length).toBeGreaterThan(0);
    });

    it('should not have comments by not existing post id', async () => {

        const comments = await wp.db
            .select()
            .from(wp.comments)
            .where(whereCommentWithPostId(wp, 1000));

        expect(comments.length).toBe(0);
    });

    it('should have comments by existing post id with comments', async () => {
        const comments = await wp.db
            .select()
            .from(wp.comments)
            .where(whereCommentWithPostId(wp, 1));
        expect(comments.length).toBeGreaterThan(0);
    });

    it('should have comment metas when hydrated', async () => {
        const comments = await wp.db
            .select()
            .from(wp.comments)
            .where(whereCommentWithPostId(wp, 1));

        const hydrated = await hydrateCommentsWithMeta(wp, comments);
        expect(hydrated.length).toBe(comments.length);
        hydrated.forEach(comment => {
            expect(comment.metas.size).toBeGreaterThan(0);
        });
    });

});
