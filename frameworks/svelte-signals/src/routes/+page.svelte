<script lang="ts">

    export const ssr = false;

    import NodeAttributes from '$lib/components/NodeAttributes.svelte'
    import Tree from '$lib/components/Tree.svelte'
    import { type Nil, TreeNode } from '$lib/model.svelte'
    import { onMount, setContext } from 'svelte'
    import { SelectedNodeStore } from '$lib/services/selected-node-store.svelte'

    let tree = $state<TreeNode | Nil>(void 0)

    onMount(async () => {
        const res = await fetch("/api/tree");
        const json = await res.json();
        tree = TreeNode.fromRaw(json)
    })

    setContext(SelectedNodeStore, new SelectedNodeStore());
</script>

<main class="grid grid-cols-2 p-4">
  {#if tree}
    <Tree node={tree} />
    <NodeAttributes />
  {/if}
</main>
