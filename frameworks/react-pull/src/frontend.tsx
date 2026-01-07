/**
 * This file is the entry point for the React app, it sets up the root
 * element and renders the App component to the DOM.
 *
 * It is included in `src/index.html`.
 */

import { createRoot } from "react-dom/client";
import { App } from "./app";
import { type Nil, parse, type TreeNode } from "@/model.ts";

export const tree = {
  data: null,
} as { data: TreeNode | Nil };

async function start() {
  await fetch(`${window.location.origin}/api/tree`)
    .then((res) => res.json())
    .then((json) => {
      tree.data = parse(json);
    });
  const root = createRoot(document.getElementById("root")!);
  root.render(<App />);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", start);
} else {
  start();
}
