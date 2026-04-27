import { createContext, useContext, useState, useMemo, type ReactNode } from "react";
import { Tree, type Nil, type DisplayedTreeNode, type DisplayedTreeNodeAttr } from "./model";

interface TreeContextValue {
  tree: Tree;
  flattened: DisplayedTreeNode[];
  selectedId: string | Nil;
  selectedTitle: string | Nil;
  attributes: DisplayedTreeNodeAttr[];
  setSelectedId: (id: string | Nil) => void;
  edit: (nodeId: string, attrId: string, value: string) => void;
  toggle: (nodeId: string) => void;
}

const TreeContext = createContext<TreeContextValue | undefined>(undefined);

interface TreeProviderProps {
  children: ReactNode;
  initialTree: Tree;
}

export function TreeProvider({ children, initialTree }: TreeProviderProps) {
  const [tree, setTree] = useState<Tree>(initialTree);
  const [selectedId, setSelectedId] = useState<string | Nil>(undefined);

  const flattened = useMemo(() => tree.flatten(), [tree]);

  const selectedTitle = useMemo(() => {
    return selectedId ? tree.nodeTitle(selectedId) : undefined;
  }, [selectedId, tree]);

  const attributes = useMemo(() => {
    return selectedId ? tree.attributes(selectedId) : [];
  }, [selectedId, tree]);

  const edit = (nodeId: string, attrId: string, value: string) => {
    setTree((t) => t.edit(nodeId, attrId, value));
  };

  const toggle = (nodeId: string) => {
    setTree((t) => t.toggle(nodeId));
  };

  const value: TreeContextValue = {
    tree,
    flattened,
    selectedId,
    selectedTitle,
    attributes,
    setSelectedId,
    edit,
    toggle,
  };

  return <TreeContext.Provider value={value}>{children}</TreeContext.Provider>;
}

export function useTree() {
  const context = useContext(TreeContext);
  if (!context) {
    throw new Error("useTree must be used within TreeProvider");
  }
  return context;
}
