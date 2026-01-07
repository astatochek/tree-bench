import { useState, useCallback, useMemo } from "react";
import {
  calculateIsEdited,
  getNodeByPath,
  type Nil,
  type NodePath,
  type TreeNode,
  updateNodeAtPath,
} from "@/model.ts";

export function useTreeStore(initialRoot: TreeNode) {
  const [root, setRoot] = useState<TreeNode>(initialRoot);

  // Get node by path
  const getNode = useCallback(
    (path: NodePath): TreeNode | Nil => {
      return getNodeByPath(root, path);
    },
    [root],
  );

  // Update attribute value
  const updateAttribute = useCallback((path: NodePath, attributeTitle: string, value: string) => {
    setRoot((prevRoot) =>
      updateNodeAtPath(prevRoot, path, (node) => ({
        ...node,
        attributes: node.attributes.map((attr) =>
          attr.title === attributeTitle ? { ...attr, value, isEdited: true } : attr,
        ),
      })),
    );
  }, []);

  // Toggle node expansion
  const toggleNodeExpansion = useCallback((path: NodePath) => {
    debugger;
    setRoot((prevRoot) =>
      updateNodeAtPath(prevRoot, path, (node) => ({
        ...node,
        isExpanded: !node.isExpanded,
      })),
    );
  }, []);

  // Get memoized isEdited for a path
  const useIsEdited = (path: NodePath) => {
    return useMemo(() => {
      const node = getNodeByPath(root, path);
      return node ? calculateIsEdited(node) : false;
    }, [root, path]); // path as dependency array element
  };

  // Get memoized node data
  const useNodeData = (path: NodePath) => {
    return useMemo(() => {
      return getNodeByPath(root, path);
    }, [root, path]);
  };

  return {
    root,
    getNode,
    updateAttribute,
    toggleNodeExpansion,
    useIsEdited,
    useNodeData,
  };
}
