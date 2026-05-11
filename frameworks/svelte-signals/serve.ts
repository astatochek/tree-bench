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

//process.env.PORT = values.port;
//
//await $`node node_modules/vite/bin/vite.js build`;
//await $`node node_modules/vite/bin/vite.js preview`;

console.warn(`Svelte WILL NOT RUN ON ${values.port}!. Serve MANUALLY`);
