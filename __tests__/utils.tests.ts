import {toMetaMap} from "../src";

describe('Utils', ()=>{

    it('Should be ok with empty lists', ()=>{
        const values: {key: string, value: string}[] = [];

        const map = toMetaMap(values);
        expect(map.size).toBe(0);
    })

    it('Should return string values', ()=>{
        const values = [
            {key:"key1", value: "1"},
            {key:"key2", value: "2"},
        ];

        const map = toMetaMap(values);

        expect(map.size).toBe(2);
        expect(map.get("key1")).toEqual("1");
        expect(map.get("key2")).toEqual("2");
    });

    it('Should return array value', ()=>{
        const values = [
            {key:"key1", value: "1"},
            {key:"key2", value: "2"},
            {key:"key1", value: "11"},
        ];

        const map = toMetaMap(values);

        expect(map.size).toBe(2);
        expect(map.get("key1")).toEqual(["1","11"]);
        expect(map.get("key2")).toEqual("2");
    });
});