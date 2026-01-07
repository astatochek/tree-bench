import { Component, createResource, Show } from "solid-js";
import { TreeNode } from "./model";
import { Tree } from "./Tree";

const App: Component = () => {
  const [tree] = createResource(() => Promise.resolve(TreeNode.fromRaw(genTree(5, 5, 0, 0))));
  return (
    <main class="grid grid-cols-2 p-4">
      <Show when={tree()}>
        <Tree node={tree()!} />
      </Show>
    </main>
  );
};

export default App;

function genTree(width: number, depth: number, level: number, index: number): any {
  const children =
    level === depth - 1
      ? []
      : Array.from(Array(width).keys()).map((index) => genTree(width, depth, level + 1, index));
  return {
    title: `Node ${level}-${index}`,
    attributes: Array.from(Array(3).keys()).map((attrIdx) => ({
      title: `attr ${level}-${index} #${attrIdx + 1}`,
      value: "10",
    })),
    children,
  };
}
