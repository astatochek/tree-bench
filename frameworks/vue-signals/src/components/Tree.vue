<script setup lang="ts">
import type { TreeNode } from "@/model.ts";
import { useTreeStore } from "@/stores/useTree.ts";
import { computed } from "vue";
import { useSelectedNodeStore } from "@/stores/useSelectedNode.ts";

const props = defineProps<{
  node: TreeNode;
}>();

const { isSelected, setSelectedNode } = useSelectedNodeStore();

const isThisNodeSelected = computed(() => isSelected(props.node));
</script>

<template>
  <div class="ml-5">
    <div
      class="flex items-center w-fit cursor-pointer py-2 min-h-8 rounded pr-2"
      :class="{ 'bg-blue-100': isThisNodeSelected }"
    >
      <button
        v-if="node.children.length"
        class="toggle-button p-1 mr-2 w-6 h-6 rounded hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-2 transition-colors duration-200 flex items-center justify-center"
        @click="node.isExpanded.value = !node.isExpanded.value"
      >
        <span
          class="toggle-icon text-xs text-gray-600 transition-transform duration-200 inline-block"
          :class="{ '-rotate-90': !node.isExpanded.value }"
          :data-testid="'expand:' + node.title"
        >
          ▼
        </span>
      </button>
      <span v-else class="w-6 mr-2"></span>

      <span
        @click="setSelectedNode(node)"
        class="node-title text-sm text-gray-800 flex-1"
        :title="node.title"
      >
        {{ node.title }}
      </span>

      <span v-if="node.isEdited.value" class="ml-2 text-sm" :data-testid="'pencil:' + node.title">
        ✏️
      </span>
    </div>
    <div
      v-if="node.isExpanded.value"
      class="children-container border-l border-dashed border-gray-300 ml-3 pl-2"
    >
      <Tree v-for="(child, index) in node.children" :node="child" :key="index"></Tree>
    </div>
  </div>
</template>
