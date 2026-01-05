import { Component, computed, inject } from "@angular/core";
import { SelectedNodeProvider } from './selected-node.provider'
import { TreeNodeAttr } from './model'


@Component({
  selector: 'node-attributes',
  template: `
    <div class=" rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div class="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-800">
          {{ node()?.title }}
        </h3>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
              Edited
            </th>
            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Title
            </th>
            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Value
            </th>
          </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            @if (!node()?.attributes?.length) {
              <tr>
                <td colspan="3" class="px-4 py-8 text-center text-gray-500 text-sm">
                  No attributes defined
                </td>
              </tr>
            } @else {
              @for (attr of attributes(); track $index) {
                <tr class="hover:bg-gray-50 transition-colors duration-150">
                  <!-- Edited Column -->
                  <td class="px-4 py-3 whitespace-nowrap">
                    @if (attr.isEdited()) {
                      <span class="text-orange-500" title="This attribute has been edited">
                    ✏️
                  </span>
                    }
                  </td>

                  <!-- Title Column -->
                  <td class="px-4 py-3">
                <span class="text-sm font-medium text-gray-900">
                  {{ attr.title }}
                </span>
                  </td>

                  <td class="px-4 py-3">
                    <div class="relative">
                      <input
                        type="text"
                        [value]="attr.value"
                        (input)="setValue(attr, $event)"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                           text-sm transition-colors duration-200"
                      />
                    </div>
                  </td>
                </tr>
              }
            }
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class NodeAttributesComponent {
  readonly selectedNodeProvider = inject(SelectedNodeProvider);

  readonly node = this.selectedNodeProvider.selected
  readonly attributes = computed(() => this.node()?.attributes ?? [])

  setValue(attr: TreeNodeAttr, event: Event): void {
    attr.value = (event.target as HTMLInputElement).value;
  }
}
