<script lang="ts">
    import { fade } from "svelte/transition";
    import EditEntry from "./Models/EditEntry.svelte";
    import { generateUUID } from "../utils/misc";

    let showEditModal: boolean = false;
</script>

<EditEntry
    on:modalClose={(e) => {
        showEditModal = false;
    }}
    {showEditModal}
    modalID={"moadl_addentry_" + generateUUID()}
    editTarget={null}
/>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
    in:fade={{ duration: 100, delay: 100 }}
    class="icon-entry"
    on:click|preventDefault|stopPropagation={(e) => {
        showEditModal = true;
    }}
>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="58"
        height="58"
        fill="white"
        viewBox="0 0 16 16"
    >
        <path
            d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"
        />
        <path
            d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"
        />
    </svg>
</div>

<style>
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
