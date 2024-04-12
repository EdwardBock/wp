import {getWP} from "../test-utils";
import {queryUsers} from "../src";

describe('Users table', () => {

    const wp = getWP();

    afterAll(()=> {
        wp.destroy();
    });

    it('should have users', async ()=> {
        const result = await wp.db
            .select()
            .from(wp.users);

        expect(result.length).toBeGreaterThan(0);
    });

    it('should find users by id', async ()=> {

        const result = await queryUsers(wp,{
            ids: [2,3],
        });

        expect(result.length).toBeGreaterThan(0);
        const resultIds = result.map(u => u.id);
        resultIds.forEach(id => {
            expect([2,3].includes(id)).toBeTruthy();
        });

    });

    it("Should insert a user meta", async ()=>{
        wp.db.insert(wp.userMeta).values(
            {
                userId: 1,
                key: "some_key",
                value: "some-value",
            }
        )
    });

    it("Should get admin users", async ()=>{

        const users = await queryUsers(wp, {
            roles: ["administrator"],
        });

        expect(users.length).toBeGreaterThan(0);
        users.forEach(user => {
            expect(user.metas.get("wp_capabilities")?.includes("administrator")).toBeTruthy();
        })

    });



});
