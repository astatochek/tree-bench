import "./index.css";
import { TreeProvider, useTree } from "@/tree-provider.tsx";
import { type NodePath, parse } from "./model";
import { TreeNode } from "@/tree-node.tsx";

const tree = {
  json: parse(genTree(5, 5, 0, 0)),
};

const INITIAL_PATH: NodePath = [];

export function App() {
  return (
    <TreeProvider initialRoot={tree.json}>
      <Main />
    </TreeProvider>
  );
}

function Main() {
  const tree = useTree();
  return (
    <main className="grid grid-cols-2 p-4">
      <TreeNode node={tree.root} path={INITIAL_PATH} />
    </main>
  );
}

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
