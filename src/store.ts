import { derived, writable, type Readable } from 'svelte/store';
import type { ApplicationState, Entry, LocalConfigure, PageConfigure, SubPage } from './types';
import clone from 'just-clone';
import { CONFIGURE } from './configure';
import { createEmptyConfigure } from './utils/misc';

function createLocalConfigure() {
    const defaultConfigure: LocalConfigure = {
        theme: {
            bgType: "gradient",
            bgGradient: "linear-gradient(-20deg, rgb(4, 114, 114) 0%, rgb(29, 16, 53) 100%)",
            bgPicture: "url('https://unsplash.it/1920/1080/?random')"
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
        addNewEntry: (targetSubPage: string, entryInfo: Entry) => update((original) => {
            original.pageConfigure.pages[targetSubPage].entries.push({
                id: original.pageConfigure.pages[original.ptrPage].entries.length + 1,
                name: entryInfo.name,
                img: entryInfo.img,
                href: entryInfo.href,
                menu: entryInfo.menu
            });
            console.debug("Store: a new entry is added to current subpage.");
            console.debug("Store: copy as local configure.");
            localConfigure.copyAsLocal(original.pageConfigure);
            return original;
        })
    }
}

export const applicationState = createApplicationState();