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
await $`bun run preview --port ${values.port}`;
