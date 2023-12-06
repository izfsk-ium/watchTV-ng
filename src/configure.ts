export const CONFIGURE = {
    USER_CONF_KEY: ".configure",
    COMMUNITY_URL: "https://www.example.com",
    GITHUB_REPO: "https://github.com/izfsk-ium/watchTV-ng"
}

export let showDebugInfo: boolean = true;

if (!showDebugInfo) {
    console.debug = (...any) => { }
}