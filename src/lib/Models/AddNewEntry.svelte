<script lang="ts">
    import { applicationState } from "../../store";
    import ModalContainer from "../ModalContainer.svelte";
    import type { MenuEntry as MenuEntry_T } from "../../types";
    import { fade } from "svelte/transition";
    import MenuEntry from "./MenuEntry.svelte";
    import { isValidHttpUrl } from "../../utils/misc";

    let showAddEntry: boolean = false;

    let modalID = "MODAL_" + Math.random().toString();

    function handleAddNew() {
        showAddEntry = true;
    }

    let name: string = "";
    let icon: string = "assets/default_entry_icon.svg";
    let href: string = "";

    let isError: boolean = false;
    let errorMsg: string = "";

    let addedMenus: Array<MenuEntry_T> = [];

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
            applicationState.addNewEntry($applicationState.ptrPage, {
                id: -1, // auto increased by store
                name: name,
                img: icon,
                href: href,
                menu: addedMenus,
            });
            handleClose();
        }
    }

    function handleClose() {
        showAddEntry = false;
        name = "";
        href = "";
        icon = "assets/default_entry_icon.svg";
        addedMenus = [];
        (document.getElementById(modalID) as HTMLDialogElement).close();
    }

    // menu edit modal
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

<ModalContainer bind:showModal={showAddEntry} id={modalID}>
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

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
    in:fade={{ duration: 100, delay: 100 }}
    class="icon-entry"
    on:click={handleAddNew}
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
