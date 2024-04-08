import {queryPosts} from "../src";
import {getWP} from "../test-utils";


describe('Posts table', () => {

    const wp = getWP();

    afterAll(()=> {
        wp.destroy();
    });

    it('should query posts', async () => {
        const posts = await queryPosts(wp);
        expect(posts.length).toBeGreaterThan(0);
        for (const post of posts) {
            expect(post.title.length).toBeGreaterThan(0);
        }
    });

    it('should get posts by category', async () => {

        const posts = await queryPosts(wp, {
            terms: {
                post_tag: [4]
            }
        });

        expect(posts.length).toBeGreaterThan(0);
        expect(posts[0]?.terms.size).toBeGreaterThan(0);
    });

    it('should get draft posts', async () => {

        const posts = await queryPosts(wp, {
            postStatus: "draft",
        });

        posts.forEach(p => {
            expect(p.status).toBe("draft");
        });
    });

    it('should get only 2 and a second page', async () => {

        const pageOnePosts = await queryPosts(wp, {
            perPage: 2,
        });

        expect(pageOnePosts.length).toBe(2);

        const pageTwoPosts = await queryPosts(wp, {
            perPage: 2,
            page: 2,
        });

        expect(pageTwoPosts.length).toBe(2);

        const ids = new Set([
            ...pageOnePosts.map(p => p.id),
            ...pageTwoPosts.map(p => p.id),
        ]);

        expect(ids.size).toBe(4);
    });

    it('should find posts by author', async () => {
        const posts = await queryPosts(wp, {
            author: {
                inIds: [1],
            }
        });

        posts.forEach(p => {
            expect(p.author).toBe(1);
        });
    });

    it('should find posts by category', async () => {
        const posts = await queryPosts(wp, {
            terms: {
                category: ["category-1"],
            }
        });

        posts.forEach(p => {
            expect(p.terms.has("category")).toBeTruthy();
            expect(p.terms.get("category")?.length).toBeGreaterThan(0);
            expect(p.terms.get("category")?.find(c => c.slug == "category-1")).toBeTruthy();
        })
    });

})
