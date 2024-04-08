import {Pagination} from "./base.ts";

export type CommentStatus = "hold" | "approve" | "spam" | "trash"

export type CommentsQueryArgs = Pagination & {
    postId?: number
    author?: number | string
    status?: CommentStatus
    parent?: number
}