import { Component } from "@angular/core";
import { TreeNode } from "./model";
import { TreeNodeComponent } from "./components/tree-node";
import { NodeAttributesComponent } from "./components/node-attributes";
import { tree } from "./app.config";

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
  readonly tree = TreeNode.fromRaw(tree.json!);

  constructor() {
    delete tree.json;
  }
}
