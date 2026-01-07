import { Component, createContext, createSignal, type JSX } from "solid-js";
import { type TreeNode, type Nil, unwrapSignal } from "./model";

class SelectedNodeService {
  readonly selected = unwrapSignal(createSignal<TreeNode | Nil>(void 0));
}

export const SelectedNodeContext = createContext<SelectedNodeService>({
  selected: { get: () => void 0, set: () => void 0 },
});

export const SelectedNodeProvider: Component<{ children: JSX.Element }> = (props) => {
  return (
    <SelectedNodeContext.Provider value={new SelectedNodeService()}>
      {props.children}
    </SelectedNodeContext.Provider>
  );
};
