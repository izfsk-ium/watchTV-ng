<script lang="ts">
    import { onMount } from "svelte";
    import { generateUUID } from "../../utils/misc";
    import ModalContainer from "../ModalContainer.svelte";
    import { createEventDispatcher } from "svelte";

    export let showModal: boolean;

    let isLoading: boolean = true;
    let allEmojis: Array<string> = [];

    const modalID = "emoji_select_" + generateUUID();
    const dispatch = createEventDispatcher();

    onMount(async () => {
        try {
            const request = await fetch("/emojis.json");
            const data: Array<string> = await request.json();
            allEmojis = data;
            isLoading = false;
        } catch (e) {
            console.error((e as any).toString());
            alert(e);
        }
    });

    function handleCloseModal() {
        (document.getElementById(modalID) as any).close();
    }
</script>

<ModalContainer bind:showModal id={modalID}>
    <header slot="title">
        <div class="header">
            <h1>选择图标</h1>
            <button on:click={handleCloseModal}>取消</button>
        </div>
    </header>

    <div>
        {#if isLoading}
            <em>Loading...</em>
        {:else}
            <div class="table">
                {#each allEmojis as emoji}
                    <button
                        on:click={() => {
                            handleCloseModal();
                            dispatch("modalClose", {
                                emoji: emoji,
                            });
                        }}>{emoji}</button
                    >
                {/each}
            </div>
        {/if}
    </div>
</ModalContainer>

<style>
    .table {
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        grid-template-rows: repeat(8, 1fr);
        grid-column-gap: 0px;
        grid-row-gap: 0px;
    }

    button {
        display: block;
        margin: 5px;
        padding: 5px;
        font-size: 24px;
    }

    .header {
        display: flex;
        justify-content: space-between;
    }

    .header > button {
        font-size: 16px;
        padding: 0px;
        margin: 0px;
        border: none;
        background-color: transparent;
        cursor: pointer;
    }
</style>
