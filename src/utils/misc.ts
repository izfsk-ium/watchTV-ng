import type { PageConfigure } from "../types";

export function isValidHttpUrl(string: string) {
    let url;

    try {
        url = new URL(string);
    } catch (_) {
        return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
}

export function downloadString(string: string) {
    const blob = new Blob([string], { type: 'text/json' });

    const elem = window.document.createElement('a');
    elem.href = window.URL.createObjectURL(blob);
    elem.download = "configure.json";
    document.body.appendChild(elem);
    elem.click();
    document.body.removeChild(elem);
}

export async function fetchWithCROSProxy(raw: string) {
    return await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(raw)}`)
}

export function generateUUID() { // Public Domain/MIT
    var d = new Date().getTime();//Timestamp
    var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now() * 1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16;//random number between 0 and 16
        if (d > 0) {//Use timestamp until depleted
            r = (d + r) % 16 | 0;
            d = Math.floor(d / 16);
        } else {//Use microseconds since page-load if supported
            r = (d2 + r) % 16 | 0;
            d2 = Math.floor(d2 / 16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

export function createEmptyConfigure(): PageConfigure {
    const defaultPage: string = generateUUID();
    return {
        id: generateUUID(),
        author: "Anon",
        lastModify: new Date().getTime(),
        license: "Public Domain",
        pages: {
            defaultPage: {
                id: 0,
                name: "未命名",
                character: "🔥",
                entries: []
            }
        }
    }
}