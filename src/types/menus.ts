
type Base = {
    id: number
    parent: number
    title: string
}

export type MenuItemPostType = {
    type: "post_type"
    postType: string
    postId: number
}

export type MenuItemTaxonomy = {
    type: "taxonomy"
    taxonomy:string
    termId: number
}

export type MenuItemCustom = {
    type: "custom"
    url: string
}


export type MenuItem =  Base & (MenuItemPostType | MenuItemTaxonomy | MenuItemCustom)