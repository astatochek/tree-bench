import { Injectable, signal } from "@angular/core";
import { setAttrValueAndUpdateTree, setExpandedAndUpdateTree, TreeNode } from "../model";
import { tree } from "../app.config";

@Injectable({ providedIn: "root" })
export class EditTreeService {
  readonly tree = signal<TreeNode>(TreeNode.fromRaw(tree.json!));

  constructor() {
    delete tree.json;
  }

  setAttrValue(path: number[], value: string): void {
    this.tree.update((root) => setAttrValueAndUpdateTree(path, root, value));
  }

  toggleNodeExpand(path: number[]): void {
    this.tree.update((root) => setExpandedAndUpdateTree(path, root));
  }
}
