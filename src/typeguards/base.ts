import {Relation} from "../types";

export const isStringArray = (data: any): data is string[] => {
    return Array.isArray(data) && data.find(d => typeof d != "string") == undefined;
}

export const isNumberArray = (data: any): data is number[] => {
    return Array.isArray(data) && data.find(d => typeof d != "number") == undefined;
}

export const isRelation = (data: any): data is Relation => {
    return data == "and" || data == "or";
}