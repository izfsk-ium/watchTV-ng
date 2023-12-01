<script lang="ts">
    export let currentPageIndex: number;

    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    function handleSwitchPage(action: "<-" | "->") {
        dispatch("switchPage", {
            action: action,
        });
    }
</script>

<aside class="controlbox 控制翻页功能">
    <button on:click={() => handleSwitchPage("<-")}>⇱</button>
    <br />
    <button id="currentPage">{currentPageIndex + 1}</button>
    <br />
    <button on:click={() => handleSwitchPage("->")}>⇲</button>
</aside>

<style>
    aside {
        position: absolute;
        bottom: 10px;
        left: 0;
    }

    button {
        background-color: rgba(0, 0, 0, 0.1);
        color: rgb(218, 215, 215);
        border: none;
        padding: 5px;
        width: 30px;
        cursor: pointer;
    }

    button:hover {
        border-radius: 10px;
        background-color: rgba(3, 117, 135, 0.663);
    }

    button#currentPage {
        background-color: transparent;
        border: none;
    }
</style>
