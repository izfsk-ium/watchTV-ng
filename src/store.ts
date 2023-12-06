import { derived, writable, type Readable } from 'svelte/store';
import type { ApplicationState, Entry, LocalConfigure, PageConfigure, SubPage } from './types';
import clone from 'just-clone';
import { CONFIGURE } from './configure';
import { createEmptyConfigure, generateUUID } from './utils/misc';

function createLocalConfigure() {
    const defaultConfigure: LocalConfigure = {
        theme: {
            bgType: "gradient",
            bgGradient: "linear-gradient(-20deg, rgb(4, 114, 114) 0%, rgb(29, 16, 53) 100%)",
            bgPicture: "https://unsplash.it/1920/1080/?random"
        },
        data: {
            type: "Local",
            data: JSON.stringify(createEmptyConfigure())
        }
    }
    const { subscribe, set, update } = writable(defaultConfigure as LocalConfigure);

    return {
        subscribe,
        update: (conf: LocalConfigure) => update((original) => {
            original = clone(conf); // deep copy;
            console.debug("// save to localStorage");
            localStorage.setItem(CONFIGURE.USER_CONF_KEY, JSON.stringify(conf));
            return original;
        }),
        copyAsLocal: (conf: PageConfigure) => update((original) => {
            original.data.type = "Local";
            original.data.data = JSON.stringify(conf);
            localStorage.setItem(CONFIGURE.USER_CONF_KEY, JSON.stringify(original));
            return original;
        })
    }
}

export const localConfigure = createLocalConfigure();

function createApplicationState() {
    const { subscribe, set, update } = writable({} as ApplicationState);

    return {
        subscribe,
        init: (conf: ApplicationState) => update((original) => {
            original = clone(conf);
            return original;
        }),
        switchSubPage: (targetPageUUID: string) => update((original) => {
            original.ptrPage = targetPageUUID;
            return original;
        }),
        addNewSubPage: (newPageUUID: string) => update((original) => {
            original.pageConfigure.pages[newPageUUID] = {
                id: Math.max(0, ...Object.values(original.pageConfigure.pages).map(i => i.id)) + 1,
                name: "未命名",
                character: "？",
                entries: []
            }
            localConfigure.copyAsLocal(original.pageConfigure);
            return original;
        }),
        addNewEntry: (targetSubPage: string, entryInfo: Entry) => update((original) => {
            original.pageConfigure.pages[targetSubPage].entries.push({
                id: Math.max(-1, ...original.pageConfigure.pages[targetSubPage].entries.map(i => i.id)) + 1,
                name: entryInfo.name,
                img: entryInfo.img,
                href: entryInfo.href,
                menu: entryInfo.menu
            });
            console.debug("Store: a new entry is added to current subpage.", original.pageConfigure);
            console.debug("Store: copy as local configure.");
            localConfigure.copyAsLocal(original.pageConfigure);
            return original;
        }),
        deleteEntry: (targetSubPage: string, entryID: number) => update((original) => {
            original.pageConfigure.pages[targetSubPage].entries =
                original.pageConfigure.pages[targetSubPage].entries.filter(i => i.id != entryID);
            console.debug(`Store: a entry with ID ${entryID} has been deleted.`);
            localConfigure.copyAsLocal(original.pageConfigure);
            return original;
        }),
        updateEntry: (targetSubPage: string, newEntry: Entry) => update((original) => {
            newEntry = clone(newEntry);

            // delete
            original.pageConfigure.pages[targetSubPage].entries =
                original.pageConfigure.pages[targetSubPage].entries.filter(i => i.id != newEntry.id);

            // re-push
            original.pageConfigure.pages[targetSubPage].entries.push(newEntry);

            console.debug("Store: Entry updated.", original.pageConfigure);
            localConfigure.copyAsLocal(original.pageConfigure);
            return original;
        }),
        updateSubPageTitle: (newTitle: string) => update((original) => {
            original.pageConfigure.pages[original.ptrPage].name = newTitle;
            localConfigure.copyAsLocal(original.pageConfigure);
            return original;
        }),
        updateSubPageEmoji: (newEmoji: string, targetSubPage: string) => update((original) => {
            original.pageConfigure.pages[targetSubPage].character = newEmoji;
            localConfigure.copyAsLocal(original.pageConfigure);
            return original;
        }),
        deleteSubPage: (targetSubPage: string) => update((original) => {
            let filteredPages: { [name: string]: SubPage } = {};
            for (const i of Object.keys(original.pageConfigure.pages)) {
                if (i != targetSubPage) {
                    filteredPages[i] = original.pageConfigure.pages[i];
                }
            }
            original.pageConfigure.pages = clone(filteredPages);
            if (Object.keys(original.pageConfigure.pages).length === 0) {
                applicationState.addNewSubPage(generateUUID());
            }
            if (original.ptrPage == targetSubPage) {
                original.ptrPage = Object.keys(original.pageConfigure.pages)[0] || "";
            }
            localConfigure.copyAsLocal(original.pageConfigure);
            return original;
        })
    }
}

export const applicationState = createApplicationState();