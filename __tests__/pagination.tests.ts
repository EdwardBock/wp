import {pagination} from "../src";

describe("Paged tests", () => {

    it("Should have correct limits for first page", () => {
        const paged = pagination({
            page: 1,
            perPage: 50,
        });
        expect(paged.offset).toBe(0);
        expect(paged.limit).toBe(50);
    });

    it("Should have correct limits on second page", () => {
        const paged = pagination({
            page: 2,
            perPage: 50,
        });
        expect(paged.offset).toBe(50);
        expect(paged.limit).toBe(50);
    });

    it("Should fallback to default page", () => {
        const paged = pagination({
            page: 0,
            perPage: 10,
        });
        expect(paged.offset).toBe(0);
        expect(paged.limit).toBe(10);
    });

    it("Should fallback to default perPage", () => {
        const paged = pagination({
            page: 1,
            perPage: 0,
        });
        expect(paged.offset).toBe(0);
        expect(paged.limit).toBe(25);
    });

});