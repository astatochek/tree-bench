import { Component, computed, inject, input } from "@angular/core";
import { DisplayedTreeNode } from "../model";
import { TreeStore } from "../services/tree-store.service";

@Component({
  selector: "tree-node",
  template: `
    <div [style]="node().style">
      <div class="flex items-center w-fit cursor-pointer py-2 min-h-8 rounded pr-2"
           [class]="isSelected() ? 'bg-blue-100' : ''">
        @if (node().hasChildren) {
          <button
            class="p-1 mr-2 w-6 h-6 rounded hover:bg-gray-100
               focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-2
               transition-colors duration-200 flex items-center justify-center"
            (click)="tree.toggle(node().id)"
          >
        <span
          class="toggle-icon text-xs text-gray-600 transition-transform duration-200 inline-block"
          [class]="node().isExpanded ? '': '-rotate-90' "
          [attr.data-testid]="'expand:' + node().title"
        >
          ▼
        </span>
          </button>
        } @else {
          <span class="w-6 mr-2"></span>
        }

        <span
          (click)="tree.selectedId.set(node().id)"
          class="node-title text-sm text-gray-800 flex-1"
          [title]="node().title"
        >{{ node().title }}</span>

        @if (node().isEdited) {
          <span class="ml-2 text-sm" [attr.data-testid]="'pencil:' + node().title">✏️</span>
        }
      </div>
    </div>
  `,
})
export class TreeNodeComponent {
  readonly tree = inject(TreeStore);
  readonly node = input.required<DisplayedTreeNode>();
  readonly isSelected = computed(() => this.tree.selectedId() === this.node().id);
}
