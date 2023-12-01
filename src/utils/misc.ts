import { CONFIGURE } from "../configure";
import { applicationState } from "../store";

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