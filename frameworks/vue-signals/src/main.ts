import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import type { Nil, RawTreeNode } from "@/model.ts";

export const prefetched: { tree: RawTreeNode | Nil } = { tree: null };

function mount() {
  const app = createApp(App);
  app.use(createPinia());
  app.mount("#app");
}

async function main() {
  await fetch(`${window.location.origin}/api/tree`)
    .then((res) => res.json())
    .then((json) => {
      prefetched.tree = json;
    });

  mount();
}

main();
