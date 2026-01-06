import { computed, inject, Injectable, signal } from "@angular/core";
import { findNodeByPath, Nil, TreeNode } from "../model";
import { EditTreeService } from "./edit-tree.service";

@Injectable({
  providedIn: "root",
})
export class SelectedNodeProvider {
  private readonly tree = inject(EditTreeService).tree;
  readonly selectedPath = signal<number[] | Nil>(void 0);

  readonly selectedNode = computed(() => {
    const path = this.selectedPath();
    if (!path) return;
    return findNodeByPath(this.tree(), path);
  });

  isNodeSelected(path: number[]): boolean {
    const selected = this.selectedPath();

    if (!selected || selected.length !== path.length) {
      return false;
    }

    for (let i = 0; i < path.length; i++) {
      if (path[i] !== selected[i]) {
        return false;
      }
    }

    return true;
  }
}
