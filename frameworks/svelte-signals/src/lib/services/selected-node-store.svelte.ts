import type { Nil, TreeNode } from "$lib/model.svelte";

export class SelectedNodeStore {
  private $selected: TreeNode | Nil = $state(void 0);

  get selected() {
    return this.$selected;
  }

  isSelected(node: TreeNode): boolean {
    return node === this.$selected;
  }

  select(node: TreeNode): void {
    this.$selected = node;
  }
}
