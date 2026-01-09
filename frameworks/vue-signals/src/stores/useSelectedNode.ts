import { defineStore } from "pinia";
import { shallowRef } from "vue";
import { type Nil, TreeNode } from "@/model.ts";

export const useSelectedNodeStore = defineStore("selectedNode", () => {
  const node = shallowRef<TreeNode | Nil>(void 0);

  const isSelected = (another: TreeNode) => {
    return Object.is(another, node.value);
  };

  const setSelectedNode = (another: TreeNode) => {
    node.value = another;
  };

  return { node, isSelected, setSelectedNode };
});
