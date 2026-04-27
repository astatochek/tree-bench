import type { DisplayedTreeNode } from "./model";
import { useTree } from "./TreeContext";

interface TreeNodeProps {
  node: DisplayedTreeNode;
}

export function TreeNode({ node }: TreeNodeProps) {
  const { selectedId, setSelectedId, toggle } = useTree();
  const isSelected = selectedId === node.id;

  return (
    <div style={{ marginLeft: node.style.match(/\d+/)?.[0] + "px" || "0px" }}>
      <div
        className={`flex items-center w-fit cursor-pointer py-2 min-h-8 rounded pr-2 ${
          isSelected ? "bg-blue-100" : ""
        }`}
      >
        {node.hasChildren ? (
          <button
            className="p-1 mr-2 w-6 h-6 rounded hover:bg-gray-100
               focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-2
               transition-colors duration-200 flex items-center justify-center"
            onClick={() => toggle(node.id)}
          >
            <span
              className={`toggle-icon text-xs text-gray-600 transition-transform duration-200 inline-block ${
                node.isExpanded ? "" : "-rotate-90"
              }`}
              data-testid={`expand:${node.title}`}
            >
              ▼
            </span>
          </button>
        ) : (
          <span className="w-6 mr-2"></span>
        )}

        <span
          onClick={() => setSelectedId(node.id)}
          className="node-title text-sm text-gray-800 flex-1"
          title={node.title}
        >
          {node.title}
        </span>

        {node.isEdited && (
          <span className="ml-2 text-sm" data-testid={`pencil:${node.title}`}>
            ✏️
          </span>
        )}
      </div>
    </div>
  );
}
