<script lang="ts">
    import { applicationState } from "../../store";
    import ModalContainer from "../ModalContainer.svelte";
    import type { Entry, MenuEntry as MenuEntry_T } from "../../types";
    import MenuEntry from "./MenuEntry.svelte";
    import { isValidHttpUrl } from "../../utils/misc";
    import { onMount } from "svelte";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    /**
     * @prop showEditModal : should top-level modal show
     * @prop modalID is unique ID of modal element
     * @prop editTarget is Entry or null. If null then create new entry
     */
    export let showEditModal: boolean;
    export let modalID: string;
    export let editTarget: Entry | null;

    // default values
    let name: string = "";
    let icon: string = "assets/default_entry_icon.svg";
    let href: string = "";
    let addedMenus: Array<MenuEntry_T> = [];

    onMount(() => {
        if (editTarget !== null) {
            console.debug("EditEntry : Edit entry " + editTarget);
            name = editTarget.name;
            icon = editTarget.img;
            href = editTarget.href;
            addedMenus = editTarget.menu;
        } else {
            console.debug("EditEntry : Create new entry.");
        }
    });

    let isError: boolean = false;
    let errorMsg: string = "";

    function handleAddDivider() {
        addedMenus.push({
            id: Math.max(-1, ...addedMenus.map((i) => i.id)) + 1,
            type: "Divider",
        });
        addedMenus = addedMenus;
    }

    function handleAddMenuEntry() {
        currentMenuEntryID = null;
        showEditMenuEntry = true;
    }

    function handleSave() {
        if (name.length == 0 || href.length == 0 || icon.length == 0) {
            isError = true;
            errorMsg = "有字段没有填写，请检查。";
        } else {
            if (editTarget === null) {
                // add new entry.
                applicationState.addNewEntry($applicationState.ptrPage, {
                    id: -1, // auto increased by store
                    name: name,
                    img: icon,
                    href: href,
                    menu: addedMenus,
                });
            } else {
                // Edit exist entry
                applicationState.updateEntry($applicationState.ptrPage, {
                    id: editTarget.id,
                    name: name,
                    img: icon,
                    href: href,
                    menu: addedMenus,
                });
            }

            handleClose();
        }
    }

    function handleClose() {
        dispatch("modalClose", {});
        showEditModal = false;
        name = "";
        href = "";
        icon = "assets/default_entry_icon.svg";
        addedMenus = [];
        (document.getElementById(modalID) as HTMLDialogElement).close();
    }

    /**
     *
     * Modal : Edit menus
     *
     */
    let showEditMenuEntry: boolean = false;
    let currentMenuEntryID: number | null = null; // null = new
    let currentMenuEntryName: string = "";
    let currentMenuEntryTarget: string = "";

    function handleSaveMenuEntry() {
        if (
            !isValidHttpUrl(currentMenuEntryTarget) ||
            currentMenuEntryName.trim().length == 0
        ) {
            alert("无效的目标或名称为空！");
            return;
        }
        if (currentMenuEntryID === null) {
            // new item
        } else {
            // delete old
            handleDeleteMenuEntry(currentMenuEntryID);
        }
        addedMenus.push({
            id:
                currentMenuEntryID == null
                    ? Math.max(-1, ...addedMenus.map((i) => i.id)) + 1
                    : currentMenuEntryID,
            type: "Entry",
            name: currentMenuEntryName,
            href: currentMenuEntryTarget,
        } as MenuEntry_T);

        addedMenus = addedMenus;
        handleCancelEditMenuEntry(); // close and clean up
    }

    function handleCancelEditMenuEntry() {
        currentMenuEntryName = "";
        currentMenuEntryTarget = "";
        currentMenuEntryID = null;
        showEditMenuEntry = false;
        (document.getElementById(modalID + "_ma") as HTMLDialogElement).close();
    }

    function handleDeleteMenuEntry(targetEntryID: number) {
        addedMenus = addedMenus.filter((i) => i.id !== targetEntryID);
        return null;
    }

    function handleEditMenuEntry(targetEntryID: number) {
        const originalEntry = addedMenus.filter(
            (i) => i.id == targetEntryID,
        )[0];
        currentMenuEntryID = targetEntryID;
        currentMenuEntryName = originalEntry.name || "";
        currentMenuEntryTarget = originalEntry.href || "";
        showEditMenuEntry = true;
        return null;
    }

    function handleMoveMenuEntry(id: number, direction: "up" | "down"): null {
        const originalEntry = addedMenus.filter((i) => i.id == id)[0];
        if (direction == "down") {
            // swap it's id with the next one
            const nextOne =
                addedMenus[addedMenus.findIndex((i) => i.id == id) + 1];
            if (typeof nextOne === "undefined") {
                return null;
            }
            let tmp = nextOne.id;
            nextOne.id = id;
            originalEntry.id = tmp;
        } else {
            // swap it's id with the pervious one
            const perviousOne =
                addedMenus[addedMenus.findIndex((i) => i.id == id) - 1];
            if (typeof perviousOne === "undefined") {
                return null;
            }
            let tmp = perviousOne.id;
            perviousOne.id = id;
            originalEntry.id = tmp;
        }

        addedMenus = addedMenus;
        return null;
    }
</script>

<ModalContainer bind:showModal={showEditMenuEntry} id={modalID + "_ma"}>
    <div slot="title">
        <h2>编辑菜单项目</h2>
    </div>

    <div class="holder-left">
        <fieldset>
            <span>名称：</span>
            <input required bind:value={currentMenuEntryName} />
        </fieldset>
        <fieldset>
            <span>链接：</span>
            <input required bind:value={currentMenuEntryTarget} />
        </fieldset>
    </div>

    <div class="form-actions">
        <button on:click={handleSaveMenuEntry}>保存</button>
        <button class="delete" on:click={handleCancelEditMenuEntry}>取消</button
        >
    </div>
</ModalContainer>

<ModalContainer bind:showModal={showEditModal} id={modalID}>
    <div slot="title">
        {#if isError}
            <h2>错误：{errorMsg}</h2>
        {:else}
            <h2>新增一个项目</h2>
        {/if}
    </div>

    <div class="holder">
        <div class="holder-left">
            <fieldset>
                <span>名称：</span>
                <input required bind:value={name} />
            </fieldset>
            <fieldset>
                <span>图标：</span>
                <input required bind:value={icon} />
            </fieldset>
            <fieldset>
                <span>链接：</span>
                <input required bind:value={href} />
            </fieldset>
        </div>
        <div class="holder-right">
            <img src={icon} alt="ICON" />
        </div>
    </div>

    <div class="menu">
        <div class="menu-actions">
            <button on:click|preventDefault={handleAddMenuEntry}
                >新增菜单</button
            >
            <button on:click|preventDefault={handleAddDivider}
                >新增分割线</button
            >
        </div>
        <div class="menu-items">
            {#each addedMenus.sort((a, b) => a.id - b.id) as entry}
                <MenuEntry
                    handleDelete={handleDeleteMenuEntry}
                    handleEdit={handleEditMenuEntry}
                    handleMove={handleMoveMenuEntry}
                    {entry}
                />
            {/each}
        </div>
    </div>

    <div class="form-actions">
        <button on:click={handleSave}>保存</button>
        <button class="delete" on:click={handleClose}>取消</button>
    </div>
</ModalContainer>

<style>
    div.menu {
        margin-top: 10px;
        margin-bottom: 10px;
        border: 1px dashed gray;
        border-radius: 8px;
        padding: 5px;
    }
    fieldset {
        border: none;
    }
    fieldset > span {
        font-size: 16px;
    }
    button.delete {
        background-color: rgb(195, 0, 0);
        color: white;
    }
    button {
        cursor: pointer;
        border: none;
        background-color: rgba(0, 179, 255, 0.818);
        padding: 10px;
        min-width: 75px;
        border-radius: 8px;
    }
    .form-actions {
        display: flex;
        justify-content: end;
    }
    .form-actions > button {
        margin-left: 5px;
    }

    .menu-items {
        max-height: 400px;
        overflow: auto;
    }

    .menu-actions {
        display: flex;
        justify-content: space-between;
    }
    img {
        height: 125px;
        width: 125px;
        border: 1px solid grey;
        border-radius: 25px;
        margin-left: 10px;
    }

    .holder {
        display: flex;
        justify-content: space-between;
        padding-top: 25px;
        padding-bottom: 20px;
    }

    .holder-left {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
    }

    .holder-right {
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>
