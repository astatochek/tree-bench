import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import devtools from "solid-devtools/vite";

export default defineConfig({
  plugins: [devtools(), solidPlugin(), tailwindcss()],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        bypass: (req, res, options) => {
          res!.writeHead(200, { "Content-Type": "application/json" });
          res!.end(JSON.stringify(genTree(8, 7, 0, 0)));
          return false;
        },
      },
    },
  },
  preview: {
    proxy: {
      "/api": {
        bypass: () => false,
      },
    },
    host: process.env.HOST,
  },
  build: {
    target: "esnext",
  },
});

function genTree(width: number, depth: number, level: number, index: number): unknown {
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
