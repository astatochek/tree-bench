import { useState, useCallback, useMemo } from "react";
import {
  calculateIsEdited,
  getNodeByPath,
  type Nil,
  type NodePath,
  type TreeNode,
  updateNodeAtPath,
} from "@/model.ts";

export interface TreeContextType {
  root: TreeNode;
  updateAttribute: (path: NodePath, attributeTitle: string, value: string) => void;
  toggleNodeExpansion: (path: NodePath) => void;
  useIsEdited: (path: NodePath) => boolean;
  getNode: (path: NodePath) => TreeNode | Nil;
  useIsSelected: (path: NodePath) => boolean;
  selectPath: (path: NodePath) => void;
  selectedNode: TreeNode | Nil;
  selectedPath: NodePath | Nil;
}

export function useTreeStore(initialRoot: TreeNode): TreeContextType {
  const [root, setRoot] = useState<TreeNode>(initialRoot);
  const [selectedPath, selectPath] = useState<NodePath | Nil>(void 0);

  // Get node by path
  const getNode = useCallback(
    (path: NodePath): TreeNode | Nil => {
      return getNodeByPath(root, path);
    },
    [root],
  );

  const selectedNode = useMemo(() => {
    if (!selectedPath) {
      return;
    }
    return getNodeByPath(root, selectedPath);
  }, [root, selectedPath]);

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

  const useIsSelected = (path: NodePath) => {
    return useMemo(() => {
      if (!selectedPath || path.length !== selectedPath.length) {
        return false;
      }
      for (let i = 0; i < path.length; i++) {
        if (path[i] !== selectedPath[i]) {
          return false;
        }
      }
      return true;
    }, [path, selectedPath]);
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
    selectPath,
    useIsSelected,
    selectedNode,
    selectedPath,
  };
}
