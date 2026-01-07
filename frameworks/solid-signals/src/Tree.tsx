import { Component, For, Show } from "solid-js";
import { TreeNode } from "./model";

export const Tree: Component<{ node: TreeNode }> = (props) => {
  const isSelected = false;
  return (
    <div class="ml-5">
      <div
        class={`flex items-center w-fit cursor-pointer py-2 min-h-8 rounded pr-2" ${isSelected ? "bg-blue-100" : ""}`}
      >
        <Show when={props.node.children.length} fallback={<span class="w-6 mr-2"></span>}>
          <button
            class="toggle-button p-1 mr-2 w-6 h-6 rounded hover:bg-gray-100
               focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-2
               transition-colors duration-200 flex items-center justify-center"
            onClick={() => props.node.isExpanded.set((v) => !v)}
          >
            <span
              class={`toggle-icon text-xs text-gray-600 transition-transform duration-200 inline-block ${!props.node.isExpanded.get() && "-rotate-90"}`}
              data-testid={"expand:" + props.node.title}
            >
              ▼
            </span>
          </button>
        </Show>

        <span class="node-title text-sm text-gray-800 flex-1" title={props.node.title}>
          {props.node.title}
        </span>

        <Show when={props.node.isEdited()}>
          <span class="ml-2 text-sm" data-testid={"pencil:" + props.node.title}>
            ✏️
          </span>
        </Show>
      </div>
      <Show when={props.node.isExpanded.get() && props.node.children}>
        <div class="children-container border-l border-dashed border-gray-300 ml-3 pl-2">
          <For each={props.node.children}>{(child) => <Tree node={child}></Tree>}</For>
        </div>
      </Show>
    </div>
  );
};
