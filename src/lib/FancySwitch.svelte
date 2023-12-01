<script lang="ts">
    import { createEventDispatcher } from "svelte";

    export let on: boolean;

    const dispatch = createEventDispatcher();

    function onSwitch() {
        dispatch("switch", {});
    }

    const randomID: string = "SWITCH-" + Math.random().toString();
</script>

<div>
    <input
        on:change={onSwitch}
        bind:checked={on}
        type="checkbox"
        id={randomID}
    />
    <label for={randomID}></label>
</div>

<style>
    div {
        margin-top: 10px;
        margin-bottom: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    input[type="checkbox"] {
        height: 0;
        width: 0;
        visibility: hidden;
    }

    label {
        cursor: pointer;
        text-indent: -9999px;
        width: 80px;
        height: 40px;
        background: grey;
        display: block;
        border-radius: 100px;
        position: relative;
    }

    label:after {
        content: "";
        position: absolute;
        top: 5px;
        left: 5px;
        width: 32px;
        height: 32px;
        background: #fff;
        border-radius: 32px;
        transition: 0.3s;
    }

    input:checked + label {
        background: #bada55;
    }

    input:checked + label:after {
        left: calc(100% - 5px);
        transform: translateX(-100%);
    }

    label:active:after {
        width: 32px;
    }
</style>
