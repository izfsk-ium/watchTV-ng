import type { LocalConfigure } from "../types";

export function updateTheme(configure: LocalConfigure) {
    /**
     * Update theme use localStorage store
     */
    const theme = configure.theme;

    switch (theme.bgType) {
        case "none": document.body.style.background = "radial-gradient(ellipse farthest-corner at center top, #3b3b3b, #000000)";
            break; // the default background is still a gradient (
        case "gradient":
            if (theme.bgGradient.endsWith(";")) {
                theme.bgGradient = theme.bgGradient.substring(0, theme.bgGradient.length-1)
            }
            document.body.style.background = theme.bgGradient;
            break;
        case "picture": document.body.style.background = `url(${theme.bgPicture})`;
            document.body.style.backgroundImage = theme.bgPicture;
            break;
    }

    console.debug("Apply theme done.");
}