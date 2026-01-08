<script lang="ts">
  import type { TreeNode } from '$lib/model.svelte'
  import Tree from './Tree.svelte'
  import { getContext } from 'svelte'
  import { SelectedNodeStore } from '$lib/services/selected-node-store.svelte'

  let { node }: { node: TreeNode }  = $props();

  const selectedNodeStore = getContext<SelectedNodeStore>(SelectedNodeStore);

  const isSelected = $derived(selectedNodeStore.isSelected(node));

</script>
<div class="ml-5" >
  <div class="flex items-center w-fit cursor-pointer py-2 min-h-8 rounded pr-2" class:bg-blue-100={isSelected} >
    {#if node.children.length}
      <button
        class="toggle-button p-1 mr-2 w-6 h-6 rounded hover:bg-gray-100
               focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-2
               transition-colors duration-200 flex items-center justify-center"
        onclick={() => node.toggle()}
      >
    <span
      class="toggle-icon text-xs text-gray-600 transition-transform duration-200 inline-block"
      class:-rotate-90={!node.isExpanded}
      data-testid={'expand:' + node.title}
    >
    ▼
    </span>
      </button>
      {:else}
      <span class="w-6 mr-2"></span>
    {/if}

    <span
      onclick={() => selectedNodeStore.select(node)}
      class="node-title text-sm text-gray-800 flex-1"
      title={node.title}
    >{ node.title }</span>

    {#if node.isEdited}
      <span class="ml-2 text-sm" data-testid={'pencil:' + node.title}>✏️</span>
    {/if}
  </div>

  <!-- Children Container -->
  {#if node.isExpanded && node.children}
    <div class="children-container border-l border-dashed border-gray-300 ml-3 pl-2">
      {#each node.children as child, index (index)}
        <Tree node={child} />
      {/each}
    </div>
  {/if}
</div>
