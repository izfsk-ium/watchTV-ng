<script lang="ts">
    import type { MenuEntry } from "../../types";

    export let entry: MenuEntry;

    export let handleDelete: (id: number) => void;
    export let handleEdit: (id: number) => MenuEntry;
    export let handleMove: (id: number, direction: "up" | "down") => void;
</script>

{#if entry.type == "Divider"}
    <section class="menu-entry menu-divider">
        <div class="menu-entry-left">
            <button>↑</button>
            <button>↓</button>
            <strong>分割线</strong>
        </div>

        <div class="menu-item-actions">
            <button class="delete">删除</button>
        </div>
    </section>
{:else}
    <section class="menu-entry menu-item">
        <div class="menu-entry-left">
            <button>↑</button>
            <button>↓</button>
            <strong>{entry.name}</strong>
        </div>

        <div class="menu-item-actions">
            <button>编辑</button>
            <button class="delete">删除</button>
        </div>
    </section>
{/if}

<style>
    .menu-entry {
        margin-top: 5px;
        margin-bottom: 5px;
        border: 1px solid transparent;
        padding-left: 5px;
        padding-right: 5px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .menu-entry:hover {
        border: 1px solid gray;
        border-radius: 8px;
    }

    .menu-entry-left {
        display: flex;
        justify-content: center;
        padding: 5px;
    }

    .menu-entry-left > button {
        border-radius: 0px;
        margin-right: 2px;
        border: 1px transparent;
    }

    .menu-entry-left > strong {
        margin-left: 10px;
    }

    strong {
        background-color: black;
        color: white;
        padding: 3px;
    }

    .menu-item-actions > button {
        border: 1px solid gray;
        padding-left: 8px;
        padding-right: 8px;
        border-radius: 0;
        cursor: pointer;
    }

    button.delete {
        background-color: #c30000;
        color: white;
    }
</style>
