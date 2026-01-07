import { Component, createResource, Show } from "solid-js";
import { TreeNode } from "./model";
import { Tree } from "./Tree";
import { SelectedNodeProvider } from "./SelectedNodeProvider";
import { NodeAttributes } from "./NodeAttributes";

const App: Component = () => {
  const [tree] = createResource(() =>
    fetch(`${window.location.origin}/api/tree`)
      .then((res) => res.json())
      .then(TreeNode.fromRaw),
  );

  return (
    <SelectedNodeProvider>
      <main class="grid grid-cols-2 p-4">
        <Show when={tree()}>
          <Tree node={tree()!} />
          <NodeAttributes />
        </Show>
      </main>
    </SelectedNodeProvider>
  );
};

export default App;
