import { Component, Show, useContext } from "solid-js";
import { Tree } from "./Tree";
import { SelectedNodeProvider } from "./SelectedNodeProvider";
import { NodeAttributes } from "./NodeAttributes";
import { TreeServiceContext, TreeServiceProvider } from "./TreeProvider";

const App: Component = () => {
  return (
    <TreeServiceProvider>
      <SelectedNodeProvider>
        <Main />
      </SelectedNodeProvider>
    </TreeServiceProvider>
  );
};

const Main: Component = () => {
  const treeService = useContext(TreeServiceContext);
  return (
    <main class="grid grid-cols-2 p-4">
      <Show when={treeService.tree()}>
        <Tree node={treeService.tree()!} />
        <NodeAttributes />
      </Show>
    </main>
  );
};

export default App;
