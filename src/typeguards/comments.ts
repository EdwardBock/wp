import {CommentStatus} from "../types";

export const isCommentStatus = (data: any): data is CommentStatus => {
    return ["hold" , "approve" , "spam" , "trash"].includes(data);
}