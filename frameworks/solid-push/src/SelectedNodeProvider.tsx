import {
  Accessor,
  Component,
  createContext,
  createMemo,
  createSignal,
  type JSX,
  Setter,
  useContext,
} from "solid-js";
import { type TreeNode, type Nil, NodePath, getNodeByPath } from "./model";
import { TreeServiceContext } from "./TreeProvider";

export class SelectedNodeService {
  readonly selectedNode: Accessor<TreeNode | Nil>;
  private readonly selectedPath: Accessor<NodePath | Nil>;
  readonly setSelectedPath: Setter<NodePath>;
  constructor() {
    const treeService = useContext(TreeServiceContext);
    const [selectedPath, setSelectedPath] = createSignal<NodePath | Nil>(void 0);
    this.selectedPath = selectedPath;
    this.setSelectedPath = setSelectedPath as Setter<NodePath>;
    this.selectedNode = createMemo(() => {
      const path = selectedPath();
      const root = treeService.tree();
      if (!path || !root) return;
      return getNodeByPath(root, path);
    });
  }

  isSelected(path: NodePath): boolean {
    const selected = this.selectedPath();
    if (!selected || path.length !== selected.length) return false;
    for (let i = 0; i < path.length; i++) {
      if (path[i] !== selected[i]) return false;
    }
    return true;
  }
}

export const SelectedNodeContext = createContext<SelectedNodeService>(new SelectedNodeService());

export const SelectedNodeProvider: Component<{ children: JSX.Element }> = (props) => {
  return (
    <SelectedNodeContext.Provider value={new SelectedNodeService()}>
      {props.children}
    </SelectedNodeContext.Provider>
  );
};
