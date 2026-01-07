import type { NodePath, TreeNode } from "@/model.ts";
import { useTree } from "@/tree-provider.tsx";

type Props = {
  node: TreeNode;
};

export function TreeNode({ node }: Props) {
  const tree = useTree();
  const isSelected = tree.useIsSelected(node.path);
  const isEdited = tree.useIsEdited(node.path);

  return (
    <div className="ml-5">
      <div
        className={`flex items-center w-fit cursor-pointer py-2 min-h-8 rounded pr-2 ${isSelected ? "bg-blue-100" : ""}`}
      >
        {node.children.length ? (
          <button
            className="toggle-button p-1 mr-2 w-6 h-6 rounded hover:bg-gray-100
               focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-2
               transition-colors duration-200 flex items-center justify-center"
            onClick={() => tree.toggleNodeExpansion(node.path)}
          >
            <span
              className={`toggle-icon text-xs text-gray-600 transition-transform duration-200 inline-block ${node.isExpanded ? "" : "-rotate-90"}`}
              data-testid={"expand:" + node.title}
            >
              ▼
            </span>
          </button>
        ) : (
          <span className="w-6 mr-2"></span>
        )}

        <span
          onClick={() => tree.selectPath(node.path)}
          className="node-title text-sm text-gray-800 flex-1"
          title={node.title}
        >
          {node.title}
        </span>

        {isEdited && (
          <span className="ml-2 text-sm" data-testid={"pencil:" + node.title}>
            ✏️
          </span>
        )}
      </div>

      {node.isExpanded && node.children && (
        <div className="children-container border-l border-dashed border-gray-300 ml-3 pl-2">
          {node.children.map((child) => (
            <TreeNode key={child.title} node={child} />
          ))}
        </div>
      )}
    </div>
  );
}
