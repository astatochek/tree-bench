import { Injectable, signal } from "@angular/core";
import { TreeNode } from "../model";
import { tree } from "../app.config";

@Injectable({ providedIn: "root" })
export class EditTreeService {
  readonly tree = signal<TreeNode>(TreeNode.fromRaw(tree.json!), { equal: () => false });

  constructor() {
    delete tree.json;
  }

  setAttrValue(path: number[], value: string): void {
    this.tree.update((root) => {
      root.updateAttribute(path, value);
      return root;
    });
  }

  clearAttribute(path: number[]): void {
    this.tree.update((root) => {
      root.clearAttribute(path);
      return root;
    });
  }

  toggleNodeExpand(path: number[]): void {
    this.tree.update((root) => {
      root.toggleExpanded(path);
      return root;
    });
  }
}
