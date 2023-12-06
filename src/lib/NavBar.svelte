<script lang="ts">
    import type Menu from "svelte-contextmenu";
    import ContextMenu, { Item, Divider, Settings } from "svelte-contextmenu";
    import { applicationState } from "../store";
    import { generateUUID } from "../utils/misc";
    import IconAdd from "./Componments/IconAdd.svelte";
    import ChooseEmoji from "./Models/ChooseEmoji.svelte";
    import ConfirmSubPageDelete from "./Models/ConfirmSubPageDelete.svelte";

    let currentSubPage =
        $applicationState.pageConfigure.pages[$applicationState.ptrPage];

    function switchSubPage(targetPage: string) {
        console.debug(`Switch page to ${targetPage}`);
        applicationState.switchSubPage(targetPage);
    }

    $: currentSubPage =
        $applicationState.pageConfigure.pages[$applicationState.ptrPage];

    $: document.title = currentSubPage.name;

    let editMode: boolean = false;
    let editedSubPageName: string = currentSubPage.name;

    function enterEditMode() {
        editMode = true;
    }

    function exitEditMode() {
        // alse save
        const newName =
            editedSubPageName.trim().length == 0
                ? "未命名"
                : editedSubPageName.trim();
        applicationState.updateSubPageTitle(newName);
        editMode = false;
    }

    let showEmojiModal: boolean = false;
    let showDeleteConfirmModal: boolean = false;

    // context menu
    let focus: string = "";
    let contentMenu: Menu;
    const contentMenuSettings = Settings.DefaultCss();
</script>

<!-- ContextMenu -->
<ContextMenu bind:this={contentMenu} settings={contentMenuSettings}>
    <Item
        on:click={() => {
            showDeleteConfirmModal = true;
        }}
    >
        <span>删除页面</span>
    </Item>
    <Item
        on:click={() => {
            showEmojiModal = true;
        }}
    >
        <span>更换图标</span>
    </Item>
</ContextMenu>

<!-- Choose Emoji Modal -->
<ChooseEmoji
    on:modalClose={(e) => {
        showEmojiModal = false;
        applicationState.updateSubPageEmoji(e.detail.emoji, focus);
        focus = "";
    }}
    showModal={showEmojiModal}
/>

<!-- Confirm delection modal -->
<ConfirmSubPageDelete
    showModal={showDeleteConfirmModal}
    numOfEntries={focus == ""
        ? 0
        : $applicationState.pageConfigure.pages[focus].entries.length}
    nameOfSubPage={focus == ""
        ? ""
        : $applicationState.pageConfigure.pages[focus].name}
    on:cancel={(e) => {
        showDeleteConfirmModal = false;
        focus = "";
    }}
    on:confirm={(e) => {
        applicationState.deleteSubPage(focus);
        showDeleteConfirmModal = false;
        focus = "";
    }}
/>

<header>
    <section class="title">
        {#if editMode}
            <input
                on:blur={exitEditMode}
                required
                bind:value={editedSubPageName}
            />
        {:else}
            <strong on:dblclick={enterEditMode}>
                {currentSubPage.name}
            </strong>
        {/if}
    </section>

    <section class="subpages">
        {#each Object.keys($applicationState.pageConfigure.pages) as id}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <span
                on:contextmenu={(e) => {
                    contentMenu.show(e);
                    focus = id;
                    console.debug(id);
                }}
                on:click={() => {
                    switchSubPage(id);
                }}>{$applicationState.pageConfigure.pages[id].character}</span
            >
        {/each}

        <!-- Add new page -->
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <span
            class="add-new-page"
            on:click={() => {
                const newPageUUID = generateUUID();
                applicationState.addNewSubPage(newPageUUID);
                applicationState.switchSubPage(newPageUUID);
            }}><IconAdd /></span
        >
    </section>
</header>

<style>
    span.add-new-page {
        display: flex;
        justify-content: center;
        align-items: center;
    }
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
