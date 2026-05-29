import { Injectable, signal } from "@angular/core";
import { TreeNode, TreeNodeAttr } from "../model";
import { tree } from "../app.config";

@Injectable({ providedIn: "root" })
export class EditTreeService {
  readonly tree = signal<TreeNode>(TreeNode.fromRaw(tree.json!, null), { equal: () => false });

  constructor() {
    delete tree.json;
  }

  setAttrValue(attr: TreeNodeAttr, value: string): void {
    this.tree.update((root) => {
      attr.setValue(value);
      return root;
    });
  }

  toggleNodeExpand(node: TreeNode): void {
    this.tree.update((root) => {
      node.isExpanded = !node.isExpanded;
      return root;
    });
  }
}
