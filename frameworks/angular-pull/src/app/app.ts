import { Component, computed, inject } from "@angular/core";
import { TreeNode } from "./model";
import { TreeNodeComponent } from "./components/tree-node";
import { NodeAttributesComponent } from "./components/node-attributes";
import { EditTreeService } from "./services/edit-tree.service";

@Component({
  selector: "app-root",
  template: `
    <main class="grid grid-cols-2 p-4">
    <tree-node [node]="tree()" />
    <node-attributes />
    </main> 
  `,
  imports: [TreeNodeComponent, NodeAttributesComponent],
})
export class App {
  readonly editTreeService = inject(EditTreeService);
  readonly tree = computed(() => this.editTreeService.tree().toDisplayed([]));
}
