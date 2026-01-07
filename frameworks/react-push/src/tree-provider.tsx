import { createContext, useContext, type ReactNode } from "react";
import type { Nil } from "./model";
import { useTreeStore, type TreeContextType } from "@/use-tree-store.ts";
import { tree } from "@/frontend.tsx";

const TreeContext = createContext<TreeContextType | Nil>(null);

interface TreeProviderProps {
  children: ReactNode;
}

export function TreeProvider({ children }: TreeProviderProps) {
  const treeStore = useTreeStore(tree.data!);
  if (tree.data) {
    delete tree.data;
  }

  return <TreeContext.Provider value={treeStore}>{children}</TreeContext.Provider>;
}

export function useTree() {
  const context = useContext(TreeContext);
  if (!context) {
    throw new Error("useTree must be used within TreeProvider");
  }
  return context;
}
