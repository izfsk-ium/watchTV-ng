<script lang="ts">
    import { fade } from "svelte/transition";
    import { applicationState } from "../store";
    import IconEntry from "./IconEntry.svelte";
    import Controls from "./Controls.svelte";
    import type { Entry } from "../types";
    import AddNewEntry from "./AddNewEntry.svelte";

    let currentSubPage =
        $applicationState.pageConfigure.pages[$applicationState.ptrPage];
    let shouldShowControls: boolean = false;

    // process entries
    let currentStartIndex: number = 0;
    let currentShowingEntries: Array<Entry> = currentSubPage.entries.sort(
        (a, b) => a.id - b.id,
    );

    $: currentSubPage =
        $applicationState.pageConfigure.pages[$applicationState.ptrPage];

    $: if (currentSubPage.entries.length >= 10) {
        shouldShowControls = true;
    } else {
        shouldShowControls = false;
    }

    $: currentShowingEntries = currentSubPage.entries.slice(
        currentStartIndex,
        currentStartIndex + 10,
    );

    // set currentStartIndex = 0 each time subpage modified
    // only when use $applicationState this line will be exec
    // so have to use this way
    $: currentStartIndex =
        $applicationState.ptrPage.length - $applicationState.ptrPage.length;

    function handleSwitchPage(event: any) {
        if (currentStartIndex === 0 && event.detail.action === "<-") {
            console.debug("Already first page.");
            return;
        }

        if (
            currentStartIndex + 10 > currentSubPage.entries.length &&
            event.detail.action === "->"
        ) {
            console.debug("Already last page.");
            return;
        }

        switch (event.detail.action) {
            case "<-":
                currentStartIndex -= 10;
                break;
            case "->":
                currentStartIndex += 10;
                break;
        }
        currentShowingEntries = currentSubPage.entries.slice(
            currentStartIndex,
            currentStartIndex + 10,
        );
    }
</script>

<article out:fade={{ duration: 100 }} in:fade={{ duration: 100 }}>
    {#each currentShowingEntries.sort((i, j) => i.id - j.id) as entry}
        <IconEntry {entry} />
    {/each}

    {#if currentShowingEntries.length !== 10}
        <AddNewEntry />
    {/if}

    {#if shouldShowControls}
        <Controls
            on:switchPage={handleSwitchPage}
            currentPageIndex={Math.ceil(currentStartIndex / 10)}
        />
    {/if}
</article>

<style>
    article {
        width: 92%;
        margin: auto;
        margin-top: auto;
        margin-top: 43px;
        display: grid;
        column-gap: 5px;
        row-gap: 52px;
        justify-items: center;
        align-items: center;
        grid-template-columns: repeat(5, 1fr);
        grid-template-rows: repeat(2, 1fr);
    }
</style>
