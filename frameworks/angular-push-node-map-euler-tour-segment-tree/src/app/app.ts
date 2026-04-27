import { Component, computed, inject } from "@angular/core";
import { TreeNode } from "./model";
import { TreeNodeComponent } from "./components/tree-node";
import { NodeAttributesComponent } from "./components/node-attributes";
import { TreeStore } from "./services/tree-store.service";

@Component({
  selector: "app-root",
  template: `
    <main class="grid grid-cols-2 p-4">
      <div class="flex flex-col">
      @for (node of tree.flattened(); track node.id) {
        <tree-node [node]="node" />
      }
      </div> 
    <node-attributes />
    </main> 
  `,
  imports: [TreeNodeComponent, NodeAttributesComponent],
})
export class App {
  readonly tree = inject(TreeStore);
}
