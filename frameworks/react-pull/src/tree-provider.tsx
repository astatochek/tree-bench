import React, { createContext, useContext, type ReactNode } from "react";
import type { Nil, NodePath, TreeNode } from "./model";
import { useTreeStore, type TreeContextType } from "@/use-tree-store.ts";

const TreeContext = createContext<TreeContextType | Nil>(null);

interface TreeProviderProps {
  initialRoot: TreeNode;
  children: ReactNode;
}

export function TreeProvider({ initialRoot, children }: TreeProviderProps) {
  const treeStore = useTreeStore(initialRoot);

  return <TreeContext.Provider value={treeStore}>{children}</TreeContext.Provider>;
}

export function useTree() {
  const context = useContext(TreeContext);
  if (!context) {
    throw new Error("useTree must be used within TreeProvider");
  }
  return context;
}
