<script lang="ts">
    export let showModal: boolean;
    export let id: string;

    let dialog: any;

    $: if (dialog && showModal) dialog.showModal();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
{#if showModal}
    <dialog {id} bind:this={dialog} on:close={() => (showModal = false)}>
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div on:click|stopPropagation>
            <slot name="title" />
            <hr />
            <slot />
        </div>
    </dialog>
{/if}

<style>
    dialog {
        box-shadow: 0 5px 30px rgba(0, 0, 0, 0.2);
        max-width: 40em;
        border-radius: 0.2em;
        border: none;
        padding: 0;
    }

    dialog::backdrop {
        background: rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(5px);
    }

    dialog > div {
        padding: 1em;
    }

    dialog[open] {
        animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    @keyframes zoom {
        from {
            transform: scale(0.75);
        }
        to {
            transform: scale(1);
        }
    }
    dialog[open]::backdrop {
        animation: fade 0.2s ease-out;
    }
    @keyframes fade {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
</style>
