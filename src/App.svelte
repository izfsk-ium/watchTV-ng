<script lang="ts">
  import { onMount } from "svelte";
  /**
   * Main page container
   * @param none
   */
  import "./assets/global.css";
  import { CONFIGURE } from "./configure";
  import { applicationState, localConfigure } from "./store";
  import { updateTheme } from "./utils/theme";
  import NavBar from "./lib/NavBar.svelte";
  import type { PageConfigure } from "./types";
  import GridBox from "./lib/GridBox.svelte";
  import Settings from "./lib/Settings.svelte";

  onMount(async () => {
    // read application configure
    const rawConfigure = localStorage.getItem(CONFIGURE.USER_CONF_KEY);

    if (rawConfigure == null) {
      console.debug("Empty configure. use default.");
    } else {
      try {
        const parsedConfigure = JSON.parse(rawConfigure);
        localConfigure.update(parsedConfigure);
      } catch (e) {
        console.debug("Invalid local configure." + e);
      }
    }

    console.debug("Configure :", $localConfigure);
    updateTheme($localConfigure);

    // init application state
    if ($localConfigure.data.type === "Local") {
      try {
        let parsedData: PageConfigure = JSON.parse($localConfigure.data.data);
        if (typeof parsedData === "string") {
          parsedData = JSON.parse(parsedData);
        }

        applicationState.init({
          pageConfigure: parsedData,
          ptrPage: Object.keys(parsedData.pages)[0],
        });
      } catch (e) {
        console.debug("Unable to parse page configure file!", e);
      }
    } else {
      try {
        const request = await fetch($localConfigure.data.data);
        const fetchedData: PageConfigure = await request.json();
        applicationState.init({
          pageConfigure: fetchedData,
          ptrPage: Object.keys(fetchedData.pages)[0],
        });
      } catch (e) {
        console.debug(
          "Unable to load page configure from " + $localConfigure.data.data,
          e,
        );
      }
    }

    isLoading = false;
  });

  function switchSettings() {
    showSettingsPage = !showSettingsPage;
  }

  let isLoading: boolean = true;
  let showSettingsPage: boolean = false;
</script>

<main>
  {#if isLoading}
    <p id="loading">Loading</p>
  {:else if showSettingsPage}
    <button on:click={switchSettings}>❌</button>
    <Settings />
  {:else}
    <button on:click={switchSettings}>⚙️</button>
    <NavBar />
    <GridBox />
  {/if}
</main>

<style>
  #loading {
    text-align: center;
    padding-top: 230px;
    font-size: 25px;
  }
  main {
    backdrop-filter: blur(8px);
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 950px;
    height: 560px;
    background: #00000033;
    border-radius: 15px;
    box-shadow: 0 5px 30px rgba(0, 0, 0, 0.2);
  }

  button {
    font-size: x-large;
    position: fixed;
    top: 10px;
    right: 10px;
    opacity: 80%;
    cursor: pointer;
    background-color: transparent;
    border: none;
    z-index: 999;
  }
</style>
