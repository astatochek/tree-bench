import { defineStore, storeToRefs } from "pinia";
import { computed, shallowRef } from "vue";
import { getNodeByPath, type Nil, type NodePath } from "@/model.ts";
import { useTreeStore } from "@/stores/useTree.ts";

export const useSelectedNodeStore = defineStore("selectedNode", () => {
  const selectedPath = shallowRef<NodePath | Nil>(void 0);

  const { tree } = storeToRefs(useTreeStore());

  const selectedNode = computed(() => {
    const selected = selectedPath.value;
    if (!selected) {
      return;
    }
    return getNodeByPath(tree.value, selected);
  });

  const setSelectedPath = (path: NodePath) => {
    selectedPath.value = path;
  };

  const isSelected = (path: NodePath) => {
    const selected = selectedPath.value;
    if (!selected || selected.length !== path.length) {
      return false;
    }

    for (let i = 0; i < path.length; i++) {
      if (path[i] !== selected[i]) {
        return false;
      }
    }

    return true;
  };

  return { selectedNode, setSelectedPath, isSelected };
});
