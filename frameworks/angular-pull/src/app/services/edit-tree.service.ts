import { Injectable, signal } from "@angular/core";
import { setAttrValueAndUpdateTree, setExpandedAndUpdateTree, TreeNode } from "../model";

@Injectable({ providedIn: "root" })
export class EditTreeService {
  readonly tree = signal<TreeNode>(
    TreeNode.fromRaw({
      title: "Root Node 1",
      attributes: [{ title: "attr1", value: "10" }],
      children: [
        {
          title: "Child 1.1",
          attributes: [{ title: "attr1.1", value: "10" }],
          children: [
            {
              title: "Grandchild 1.1.1",
              children: [],
            },
          ],
        },
        {
          title: "Child 1.2",
          children: [],
        },
      ],
    }),
  );

  setAttrValue(path: number[], value: string): void {
    this.tree.update((root) => setAttrValueAndUpdateTree(path, root, value));
  }

  toggleNodeExpand(path: number[]): void {
    this.tree.update((root) => setExpandedAndUpdateTree(path, root));
  }
}
