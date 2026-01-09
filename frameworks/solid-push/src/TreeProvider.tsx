import {
  Accessor,
  Component,
  createContext,
  createResource,
  createSignal,
  type JSX,
  Resource,
  Setter,
} from "solid-js";
import { type TreeNode, type Nil, updateNodeAtPath, NodePath, parse } from "./model";

export class TreeService {
  readonly tree: Resource<TreeNode>;
  private readonly mutate: Setter<TreeNode | Nil>;
  constructor() {
    const [tree, actions] = createResource(() =>
      fetch(`${window.location.origin}/api/tree`)
        .then((res) => res.json())
        .then((json) => parse(json, [])),
    );
    this.tree = tree;
    this.mutate = actions.mutate as Setter<TreeNode | Nil>;
  }

  setAttribute(path: NodePath, attributeTitle: string, value: string): void {
    this.mutate((root) =>
      updateNodeAtPath(
        root!,
        path,
        (node) => ({
          ...node,
          attributes: node.attributes.map((attr) =>
            attr.title === attributeTitle ? { ...attr, value, isEdited: true } : attr,
          ),
          isOwnEdited: true,
        }),
        true,
      ),
    );
  }

  toggleNodeExpansion(path: NodePath): void {
    this.mutate((root) =>
      updateNodeAtPath(
        root!,
        path,
        (node) => ({
          ...node,
          isExpanded: !node.isExpanded,
        }),
        false,
      ),
    );
  }
}

export const TreeServiceContext = createContext<TreeService>(new TreeService());

export const TreeServiceProvider: Component<{ children: JSX.Element }> = (props) => {
  return (
    <TreeServiceContext.Provider value={new TreeService()}>
      {props.children}
    </TreeServiceContext.Provider>
  );
};
