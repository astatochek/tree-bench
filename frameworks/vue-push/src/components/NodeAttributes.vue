<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useSelectedNodeStore } from "@/stores/useSelectedNode.ts";
import { computed } from "vue";
import { useTreeStore } from "@/stores/useTree.ts";

const { setAttribute } = useTreeStore();
const { selectedNode: node } = storeToRefs(useSelectedNodeStore());

const attributes = computed(() => node.value?.attributes ?? []);
</script>

<template>
  <div class="rounded-lg shadow-sm border border-gray-200 overflow-hidden">
    <div class="bg-gray-50 px-4 py-3 border-b border-gray-200">
      <h3 class="text-lg font-medium text-gray-800">{{ node?.title }}</h3>
    </div>

    <div v-if="attributes.length" class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              scope="col"
              class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16"
            >
              Edited
            </th>
            <th
              scope="col"
              class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Title
            </th>
            <th
              scope="col"
              class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Value
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="(attr, index) in attributes"
            :key="index"
            class="hover:bg-gray-50 transition-colors duration-150"
          >
            <td class="px-4 py-3 whitespace-nowrap">
              <span v-if="attr.isEdited">✏️</span>
            </td>

            <td class="px-4 py-3">
              <span class="text-sm font-medium text-gray-900">{{ attr.title }}</span>
            </td>

            <td class="px-4 py-3">
              <div class="relative">
                <input
                  :data-testid="attr.title"
                  type="text"
                  :value="attr.value"
                  @input="
                    setAttribute(node!.path, attr.title, ($event.target as HTMLInputElement).value)
                  "
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors duration-200"
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
