/**
 * This file is the entry point for the React app, it sets up the root
 * element and renders the App component to the DOM.
 *
 * It is included in `src/index.html`.
 */

import { createRoot } from "react-dom/client";
import { App } from "./app";
import { type Nil, type TreeNode } from "@/model.ts";

export const tree = {
  data: null,
} as { data: any };

async function start() {
  await fetch(`${window.location.origin}/api/tree`)
    .then((res) => res.json())
    .then((json) => {
      tree.data = json;
    });
  //tree.data = genTree(10, 4, 0, 0);
  const root = createRoot(document.getElementById("root")!);
  root.render(<App />);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", start);
} else {
  start();
}

//function genTree(width: number, depth: number, level: number, index: number): any {
//  const children =
//    level === depth - 1
//      ? []
//      : Array.from(Array(width).keys()).map((index) => genTree(width, depth, level + 1, index));
//  return {
//    title: `Node ${level}-${index}`,
//    attributes: Array.from(Array(3).keys()).map((attrIdx) => ({
//      title: `attr ${level}-${index} #${attrIdx + 1}`,
//      value: "10",
//    })),
//    children,
//  };
//}
