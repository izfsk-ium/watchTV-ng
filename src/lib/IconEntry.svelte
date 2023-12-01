<script lang="ts">
    import ContextMenu, { Item, Divider, Settings } from "svelte-contextmenu";
    import type { Entry } from "../types";
    import type Menu from "svelte-contextmenu";
    import { fade } from "svelte/transition";

    export let entry: Entry;

    let contentMenu: Menu;
    const contentMenuSettings = Settings.DefaultCss();

    function openTarget() {
        window.open(entry.href);
    }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
    out:fade={{ duration: 100 }}
    in:fade={{ duration: 100 }}
    on:contextmenu={(e) => {
        entry.menu.length === 0 ? e.preventDefault() : contentMenu.show(e);
    }}
    on:click={openTarget}
    on:keyup={openTarget}
    class="icon-entry"
    style={`background-image:url(${entry.img})`}
>
    {#if entry.menu.length !== 0}
        <ContextMenu bind:this={contentMenu} settings={contentMenuSettings}>
            {#each entry.menu as menuEntry}
                {#if menuEntry.type === "Divider"}
                    <Divider />
                {:else}
                    <Item>
                        <a href={menuEntry.href} target="_blank"
                            >{menuEntry.name}</a
                        >
                    </Item>
                {/if}
            {/each}
        </ContextMenu>
    {/if}
</div>

<style>
    a {
        color: unset;
        text-decoration: none;
    }

    .icon-entry {
        min-height: 128px;
        min-width: 128px;
        background-color: #8686861c;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        transition: 0.22s;
        box-shadow:
            1px 2px 4px rgb(0 0 0 / 10%),
            2px 2px 4px rgba(0, 0, 0, 0.1);
        border-radius: 30px;
        background-size: contain;
        cursor: pointer;
    }

    .icon-entry:hover {
        transform: scale(1.2);
        background-color: #f3f3f34b;
        transition: 0.12s;
    }
</style>
