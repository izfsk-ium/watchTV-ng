<script lang="ts">
    import ContextMenu, { Item, Divider, Settings } from "svelte-contextmenu";
    import type { Entry } from "../types";
    import type Menu from "svelte-contextmenu";
    import { fade } from "svelte/transition";
    import ModalContainer from "./ModalContainer.svelte";
    import { generateUUID } from "../utils/misc";
    import { applicationState } from "../store";
    import EditEntry from "./Models/EditEntry.svelte";

    export let entry: Entry;

    let contentMenu: Menu;
    const contentMenuSettings = Settings.DefaultCss();

    function openTarget() {
        window.open(entry.href);
    }

    /**
     *
     *  Modal : Confirm Delete Entry
     *
     */
    let showDeleteModal: boolean = false;
    let deleteModalID: string = "entryDelete_" + generateUUID();

    function showDeleteConfirmModal() {
        showDeleteModal = true;
    }

    const DeleteConfirmModalHandles = {
        handleClose: () => {
            showDeleteModal = false;
            (
                document.getElementById(deleteModalID) as HTMLDialogElement
            ).close();
        },

        handleConfirm: () => {
            applicationState.deleteEntry($applicationState.ptrPage, entry.id);
            DeleteConfirmModalHandles.handleClose();
        },
    };

    /**
     *
     * Modal : Edit
     *
     */
    let showEditModal: boolean = false;
    let editModalID = () => "entryEdit_" + generateUUID();

    function showEditEntryModal() {
        showEditModal = true;
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
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <span on:click={showEditEntryModal}>编辑</span>
        </Item>
        <Item>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <span class="red" on:click={showDeleteConfirmModal}>删除</span>
        </Item>
    </ContextMenu>
</div>

<!-- Edit Entry Modal -->
{#if showEditModal}
    <EditEntry
        modalID={editModalID()}
        editTarget={entry}
        {showEditModal}
        on:modalClose={(e) => {
            showEditModal = false;
        }}
    />
{/if}

<!-- Delete Entry Confirm Modal -->
<ModalContainer bind:showModal={showDeleteModal} id={deleteModalID}>
    <div slot="title">
        <h2>你确认要删除吗？</h2>
    </div>

    <div>
        <p>删除之后将不可撤销！</p>
    </div>

    <div class="form-actions">
        <button
            on:click={DeleteConfirmModalHandles.handleConfirm}
            class="confirm-delete">确定</button
        >
        <button on:click={DeleteConfirmModalHandles.handleClose}>取消</button>
    </div>
</ModalContainer>

<style>
    .form-actions {
        display: flex;
        justify-content: space-between;
    }

    .form-actions > button {
        cursor: pointer;
        border: none;
        background-color: rgba(0, 179, 255, 0.818);
        padding: 10px;
        min-width: 75px;
        border-radius: 8px;
    }

    .form-actions > button.confirm-delete {
        background-color: rgb(195, 0, 0);
        color: white;
    }

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
