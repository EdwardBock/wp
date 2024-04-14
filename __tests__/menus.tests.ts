import {getWP} from "../test-utils";
import {getMenu, getMenus} from "../src";

describe('Menus', () => {

    const wp = getWP();

    afterAll(()=> {
        wp.destroy();
    });

    it('should get all menus as a map', async ()=> {
        const result = await getMenus(wp);
        expect(result.has("menu-1")).toBeTruthy();
        expect(result.get("menu-1")?.length).toBe(2);
        expect(result.has("menu-2")).toBeTruthy();
        expect(result.get("menu-2")?.length).toBe(3);
    });

    it("Should get a single menu", async ()=>{
       const menu = await getMenu(wp, "menu-1");
       expect(menu?.length).toBe(2);
       expect(menu?.[0]?.children.length).toBe(1);
    });

    it("Should not find a not existing menu", async ()=> {
        const notExistingMenu = await getMenu(wp, "not-existing");
        expect(notExistingMenu).toBeNull();
    })
});
