<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useTreeStore } from "@/stores/useTree.ts";
import Tree from "@/components/Tree.vue";
import NodeAttributes from "@/components/NodeAttributes.vue";

const { tree } = storeToRefs(useTreeStore());
</script>
<template>
  <main class="grid grid-cols-2 p-4">
    <Tree :node="tree" />
    <NodeAttributes />
  </main>
</template>

<style scoped></style>
