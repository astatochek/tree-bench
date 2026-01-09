import { shallowRef } from "vue";
import { defineStore } from "pinia";
import { parse } from "@/model.ts";
import { prefetched } from "@/main.ts";

export const useTreeStore = defineStore("tree", () => {
  const tree = shallowRef(parse(prefetched.tree!));
  delete prefetched.tree;
  return { tree };
});
