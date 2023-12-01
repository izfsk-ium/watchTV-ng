export interface LocalConfigure {
    /**
     * @interface LocalConfigure is stored in localStorage
     */
    theme: {
        bgType: "none" | "gradient" | "picture",
        bgGradient: string,
        bgPicture: string
    },
    data: {
        /**
         * @field type : either local JSON string in localStorage or remote URL
         * @field data : if type is local then JSON string else url
         */
        type: "Local" | "Remote",
        data: string
    }
}

export interface PageConfigure {
    /**
     * @interface PageConfigure is the configure of application
     * @field id is UUID of this configure file
     * @field author is author of this configure
     * @field lastModify is UNIX timestamp of last modify date
     * @field pages is configure content
     */
    id: string,
    author: string,
    lastModify: number,
    license: string,
    pages: { [name: string]: SubPage }
}

export interface SubPage {
    /**
     * @interface SubPage is route target
     * @field id is the ID of subpage, alse used to sort display order
     * @field character is an emoji
     * @field target is UUID of target
     * @field entries is all the entries of this page
     */
    id: number,
    name: string,
    character: string,
    entries: Array<Entry>
}

export interface Entry {
    /**
     * @interface Entry
     * 
     */
    id: number,
    name: string,
    img: string,
    href: string,
    menu: Array<MenuEntry>
}

export interface MenuEntry {
    /**
     * @interface MenuEntry is entry of content-menu
     * @field type is type of this entry
     * @field name? is display name
     * @field href? is link target, 
     */
    type: "Divider" | "Entry",
    name?: string,
    href?: string

}

export interface ApplicationState {
    /**
     * @interface ApplicationState is the runtime state of application
     * @field pageConfigure should be loaded before app start
     * @field ptrPage is the UUID of current display page in pageConfigure.pages
     */
    pageConfigure: PageConfigure,
    ptrPage: string
}
