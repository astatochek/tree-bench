import { Component } from "@angular/core";
import { TreeNode } from "./model";
import { TreeNodeComponent } from "./tree-node";
import { NodeAttributesComponent } from "./node-attributes";

@Component({
  selector: "app-root",
  template: `
    <main class="grid grid-cols-2 p-4">
    <tree-node [node]="tree" />
    <node-attributes />
    </main> 
  `,
  imports: [TreeNodeComponent, NodeAttributesComponent],
})
export class App {
  readonly tree = TreeNode.fromRaw({
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
  });
}
