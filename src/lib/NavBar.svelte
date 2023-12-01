<script lang="ts">
    import { applicationState } from "../store";

    let currentSubPage =
        $applicationState.pageConfigure.pages[$applicationState.ptrPage];

    function switchSubPage(targetPage: string) {
        console.debug(`Switch page to ${targetPage}`);
        applicationState.switchSubPage(targetPage);
    }

    $: currentSubPage =
        $applicationState.pageConfigure.pages[$applicationState.ptrPage];

    $: document.title = currentSubPage.name;
</script>

<header>
    <section class="title">
        <strong>{currentSubPage.name}</strong>
    </section>

    <section class="subpages">
        {#each Object.keys($applicationState.pageConfigure.pages) as id}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <span
                on:click={() => {
                    switchSubPage(id);
                }}>{$applicationState.pageConfigure.pages[id].character}</span
            >
        {/each}
    </section>
</header>

<style>
    strong {
        font-size: 20px;
        text-transform: uppercase;
        text-align: center;
        color: #c0c6d0;
    }

    header {
        display: flex;
        justify-content: center;
        align-items: center;
        padding-top: 35px;
        position: relative;
        height: 70px;
        font-size: 20px;
    }

    section.subpages {
        background: #8787872e;
        border: 1px solid #7a7a7a69;
        display: inline-flex;
        border-radius: 30px;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        padding: 5px;
        margin-left: 10px;
        height: 20px;
    }

    span {
        margin-left: 2px;
        margin-right: 2px;
    }
</style>
