import {getWP} from "../test-utils";
import {getOption} from "../src";

describe('Options table', () => {

    const wp = getWP();

    afterAll(()=> {
        wp.destroy();
    });

    it('should get siteurl', async () => {

        const siteurl = await getOption(wp,"siteurl")

        expect(siteurl).not.toBeNull();
    });

    it("should be null with non existing options", async ()=> {
        const result = await getOption(wp, "notexisting");
        expect(result).toBeNull();
    });
})
