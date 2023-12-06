<script lang="ts">
    import { generateUUID } from "../../utils/misc";
    import ModalContainer from "../ModalContainer.svelte";
    import { createEventDispatcher } from "svelte";

    export let showModal: boolean;
    export let nameOfSubPage: string;
    export let numOfEntries: number;

    const modalID = "delection_confirm_" + generateUUID();
    const dispatch = createEventDispatcher();

    function closeModal() {
        (document.getElementById(modalID) as any).close();
    }

    function handleCancel() {
        closeModal();
        dispatch("cancel", {});
    }

    function handleConfirm() {
        closeModal();
        dispatch("confirm", {});
    }
</script>

<ModalContainer bind:showModal id={modalID}>
    <header slot="title">
        <div class="header">
            <h1>确认删除子页面「{nameOfSubPage}」</h1>
        </div>
    </header>

    <section>
        所选页面的<strong>全部{numOfEntries}个</strong>项目都会被删除！<br />
        你确定要继续吗？
    </section>

    <hr />

    <div id="actions">
        <button on:click={handleConfirm} class="red">删除</button>
        <button on:click={handleCancel}>取消</button>
    </div>
</ModalContainer>

<style>
    .header {
        display: flex;
        justify-content: space-between;
    }

    #actions {
        display: flex;
        justify-content: space-between;
        margin-top: 25px;
    }

    button {
        padding: 8px;
        font-size: 15px;
        border: 1px solid gray;
        border-radius: 0;
    }

    button.red {
        color: red;
    }
</style>
