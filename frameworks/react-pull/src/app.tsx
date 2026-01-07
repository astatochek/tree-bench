import "./index.css";
import { TreeProvider, useTree } from "@/tree-provider.tsx";
import { type NodePath, parse } from "./model";
import { TreeNode } from "@/tree-node.tsx";
import { NodeAttributes } from "@/node-attributes.tsx";

const INITIAL_PATH: NodePath = [];

export function App() {
  return (
    <TreeProvider>
      <Main />
    </TreeProvider>
  );
}

function Main() {
  const tree = useTree();
  return (
    <main className="grid grid-cols-2 p-4">
      <TreeNode node={tree.root} path={INITIAL_PATH} />
      <NodeAttributes />
    </main>
  );
}

export default App;
