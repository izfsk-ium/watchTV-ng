<script lang="ts">
    import { applicationState } from "../store";
    import type { MenuEntry } from "../types";
    import ModalContainer from "./ModalContainer.svelte";
    import { fade } from "svelte/transition";

    let showModal: boolean = false;
    let modalID = "MODAL_" + Math.random().toString();

    function handleAddNew() {
        showModal = true;
    }

    let name: string = "";
    let icon: string = "assets/default_entry_icon.svg";
    let href: string = "";

    let isError: boolean = false;
    let errorMsg: string = "";

    let addedMenus: Array<MenuEntry> = [];

    function handleAddDivider() {
        addedMenus.push({
            type: "Divider",
        });
        addedMenus = addedMenus;
    }

    function handleAddMenuEntry() {
        const name = prompt("菜单显示名称：");
        let href = prompt("目的地链接：");
        if (!href?.startsWith("http")) {
            href = "http://" + href;
        }
        addedMenus.push({
            type: "Entry",
            name: name?.toString(),
            href: href,
        });
        addedMenus = addedMenus;
    }

    function handleDeleteMenuEntry(index: number) {
        addedMenus.splice(index, 1);
        addedMenus = addedMenus;
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
        showModal = false;
        (name = ""),
            (href = ""),
            (icon = "assets/default_entry_icon.svg"),
            (addedMenus = []);
        (document.getElementById(modalID) as HTMLDialogElement).close();
    }
</script>

<ModalContainer bind:showModal id={modalID}>
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

    <hr />

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
            {#each addedMenus as entry, index}
                {#if entry.type == "Divider"}
                    <section class="menu-divider">
                        <strong>分割线</strong>
                        <div class="menu-item-actions">
                            <button
                                class="delete"
                                on:click|preventDefault={(e) => {
                                    handleDeleteMenuEntry(index);
                                }}>删除</button
                            >
                        </div>
                    </section>
                {:else}
                    <section class="menu-item">
                        <span>
                            <strong>菜单项目</strong>
                            <a href={entry.href} target="_blank">{entry.name}</a
                            >
                        </span>
                        <div class="menu-item-actions">
                            <button
                                class="delete"
                                on:click|preventDefault={(e) => {
                                    handleDeleteMenuEntry(index);
                                }}>删除</button
                            >
                        </div>
                    </section>
                {/if}
            {/each}
        </div>
    </div>

    <hr />

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
    button.delete {
        background-color: rgb(195, 0, 0);
        color: white;
    }
    button {
        cursor: pointer;
        border: none;
        background-color: rgba(0, 179, 255, 0.818);
        padding: 5px;
        border-radius: 8px;
    }
    .form-actions {
        display: flex;
        justify-content: end;
    }
    .form-actions > button {
        margin-left: 5px;
    }
    .menu-item,
    .menu-divider {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    strong {
        background-color: black;
        color: white;
        padding: 3px;
    }
    .menu-items {
        max-height: 400px;
        overflow: auto;
    }
    .menu-items > section {
        border: 1px solid;
        padding: 5px;
        margin-top: 5px;
        margin-bottom: 5px;
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
