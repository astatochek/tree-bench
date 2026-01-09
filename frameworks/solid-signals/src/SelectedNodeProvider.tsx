import { Accessor, Component, createContext, createSignal, type JSX, Setter } from "solid-js";
import { type TreeNode, type Nil } from "./model";

type SelectedNodeService = {
  selected: Accessor<TreeNode | Nil>;
  select: Setter<TreeNode>;
};

export const SelectedNodeContext = createContext<SelectedNodeService>({
  selected: () => void 0,
  select: () => void 0,
});

export const SelectedNodeProvider: Component<{ children: JSX.Element }> = (props) => {
  const [selected, select] = createSignal<TreeNode | Nil>(void 0);
  const service = { selected, select } as SelectedNodeService;
  return (
    <SelectedNodeContext.Provider value={service}>{props.children}</SelectedNodeContext.Provider>
  );
};
