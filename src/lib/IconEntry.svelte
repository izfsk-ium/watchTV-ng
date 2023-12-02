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
    on:contextmenu={(e) => contentMenu.show(e)}
    on:click={openTarget}
    on:keyup={openTarget}
    class="icon-entry"
    style={`background-image:url(${entry.img})`}
>
    <ContextMenu bind:this={contentMenu} settings={contentMenuSettings}>
        {#if entry.menu.length !== 0}
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
        {/if}

        <!-- Always have Delete and Edit entry -->
        <Item>
            <span>编辑</span>
        </Item>
        <Item>
            <span class="red">删除</span>
        </Item>
    </ContextMenu>
</div>

<style>
    .red {
        color: red;
    }

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
