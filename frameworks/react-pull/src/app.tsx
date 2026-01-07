import "./index.css";
import { TreeProvider, useTree } from "@/tree-provider.tsx";
import { NodeAttributes } from "@/node-attributes.tsx";
import { Tree } from '@/tree.tsx'

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
      <Tree node={tree.root} />
      <NodeAttributes />
    </main>
  );
}

export default App;
