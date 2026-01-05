import angularSignalsApp from './dist/angular-signals/browser/index.html'

import { parseArgs } from "util";

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
  throw new Error(`Unexpected value for "port": ${values.port}`)
}


const server = Bun.serve({
  port: values.port,
  routes: {
    "/": angularSignalsApp
  },
})

console.log(`Running Bun server on ${server.url} for Angular Signals App`)
