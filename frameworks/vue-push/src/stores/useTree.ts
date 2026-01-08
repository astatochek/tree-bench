import { ref, computed, shallowRef } from "vue";
import { defineStore } from "pinia";
import { type NodePath, parse, updateNodeAtPath } from "@/model.ts";
import { prefetched } from "@/main.ts";

export const useTreeStore = defineStore("tree", () => {
  const tree = shallowRef(parse(prefetched.tree!, []));
  delete prefetched.tree;

  const setAttribute = (path: NodePath, attributeTitle: string, value: string) => {
    tree.value = updateNodeAtPath(
      tree.value,
      path,
      (node) => ({
        ...node,
        attributes: node.attributes.map((attr) =>
          attr.title === attributeTitle ? { ...attr, value, isEdited: true } : attr,
        ),
        isOwnEdited: true,
      }),
      true,
    );
  };

  const toggleNodeExpansion = (path: NodePath) => {
    tree.value = updateNodeAtPath(
      tree.value,
      path,
      (node) => ({
        ...node,
        isExpanded: !node.isExpanded,
      }),
      false,
    );
  };

  return { tree, setAttribute, toggleNodeExpansion };
});
