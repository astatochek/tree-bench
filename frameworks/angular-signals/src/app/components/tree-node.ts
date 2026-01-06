import { Component, computed, inject, input } from "@angular/core";
import { TreeNode } from "../model";
import { SelectedNodeProvider } from "../services/selected-node.provider";

@Component({
  selector: "tree-node",
  template: `
    <div class="ml-5" >
      <div class="flex items-center w-fit cursor-pointer py-2 min-h-8 rounded pr-2" [class]="isSelected() ? 'bg-blue-100' : ''" >
        @if (node().children.length) {
          <button
            class="toggle-button p-1 mr-2 w-6 h-6 rounded hover:bg-gray-100
               focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-2
               transition-colors duration-200 flex items-center justify-center"
            (click)="node().isExpanded.set(!node().isExpanded())"
          >
        <span
          class="toggle-icon text-xs text-gray-600 transition-transform duration-200 inline-block"
          [class]="node().isExpanded() ? '': '-rotate-90' "
        >
          ▼
        </span>
          </button>
        } @else {
          <span class="w-6 mr-2"></span>
        }

        <span
          (click)="this.selectedNodeProvider.selected.set(node())"
          class="node-title text-sm text-gray-800 flex-1"
        >{{ node().title }}</span>

        @if (node().isEdited()) {
          <span class="ml-2 text-sm">✏️</span>
        }
      </div>

      <!-- Children Container -->
      @if (node().isExpanded() && node().children) {
        <div class="children-container border-l border-dashed border-gray-300 ml-3 pl-2">
          @for (child of node().children; track $index) {
            <tree-node
              [node]="child"
              class="child-node block"
            />
          }
        </div>
      }
    </div>
  `,
})
export class TreeNodeComponent {
  readonly selectedNodeProvider = inject(SelectedNodeProvider);
  readonly node = input.required<TreeNode>();

  readonly isSelected = computed(() =>
    Object.is(this.node(), this.selectedNodeProvider.selected()),
  );
}
