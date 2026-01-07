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

const html = await import("./dist/index.html");

const server = Bun.serve({
  port: values.port,
  routes: {
    "/": html.default,
  },
});

console.log(`Running Bun server on ${server.url} for React Pull App`);
