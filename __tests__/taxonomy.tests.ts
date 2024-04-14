import {getWP} from "../test-utils";
import {queryTerms} from "../src";

describe('Taxonomy', () => {

    const wp = getWP();

    afterAll(()=> {
        wp.destroy();
    });

    it('should get category terms by default', async ()=> {
        const result = await queryTerms(wp);

        expect(result.length).toBeGreaterThan(0);
    });

    it('should find post_tag terms', async ()=> {
        const result = await queryTerms(wp,{
            taxonomy: "post_tag",
        });

        expect(result.length).toBeGreaterThan(0);
    });

});
