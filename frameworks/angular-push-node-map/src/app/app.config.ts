import {
  ApplicationConfig,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from "@angular/core";
import { Nil, RawTreeNode } from "./model";

export const tree: { json: RawTreeNode | Nil } = { json: null };

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideAppInitializer(
      () => {
        tree.json = genTree(4, 10, 0, 0);
      },
      //fetch(`${window.location.origin}/api/tree`)
      //  .then((res) => res.json())
      //  .then((json) => {
      //    tree.json = json;
      //  }),
    ),
  ],
};

function genTree(width: number, depth: number, level: number, index: number): any {
  const children =
    level === depth - 1
      ? []
      : Array.from(Array(width).keys()).map((index) => genTree(width, depth, level + 1, index));
  return {
    title: `Node ${level}-${index}`,
    attributes: Array.from(Array(3).keys()).map((attrIdx) => ({
      title: `attr ${level}-${index} #${attrIdx + 1}`,
      value: "10",
    })),
    children,
  };
}
