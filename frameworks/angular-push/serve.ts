import { parseArgs } from "util";
import { $ } from "bun";

const { values } = parseArgs({
  args: Bun.argv,
  options: {
    port: {
      type: "string",
    },
  },
  strict: true,
  allowPositionals: true,
});

if (!values.port || isNaN(Number(values.port))) {
  throw new Error(`Unexpected value for "port": ${values.port}`);
}

await $`bun run build`;

const html = await import("./dist/angular-push/browser/index.html");

const server = Bun.serve({
  port: values.port,
  routes: {
    "/": html.default,
      "/api/tree": Response.json(genTree(5, 5, 0, 0))
  },
});

console.log(`Running Bun server on ${server.url} for Angular Push App`);


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
