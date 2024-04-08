import {Pagination} from "../types";

const defaultPerPage = 25;

export const pagination = (
    {
        page = 1,
        perPage = defaultPerPage,
    }: Pagination
) => {

    const _page = Math.max(1, page);
    const _perPage = (perPage < 1) ? defaultPerPage : perPage;

    return {
        limit: _perPage,
        offset: (_page - 1) * _perPage
    }
}