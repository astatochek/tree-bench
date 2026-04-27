import "./index.css";
import { TreeProvider } from "./TreeContext";
import { TreeNode } from "./TreeNode";
import { NodeAttributes } from "./NodeAttributes";
import { Tree } from "./model";
import { useTree } from "./TreeContext";
import { tree } from "@/frontend.tsx";

function AppContent() {
  const { flattened } = useTree();

  return (
    <main className="grid grid-cols-2 p-4">
      <div className="flex flex-col">
        {flattened.map((node) => (
          <TreeNode key={node.id} node={node} />
        ))}
      </div>
      <NodeAttributes />
    </main>
  );
}

export function App() {
  const initialTree = Tree.fromDto(tree.data!);

  return (
    <TreeProvider initialTree={initialTree}>
      <AppContent />
    </TreeProvider>
  );
}
