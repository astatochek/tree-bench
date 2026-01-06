import { chromium } from "playwright";
import { setupRoutes } from "./routes.ts";
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
  throw new Error(`Unexpected value for "port": ${values.port}`);
}

export async function launch(port: string) {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  await setupRoutes(page);
  // for WSL
  await page.goto(`http://host.docker.internal:${port}`);
}

await launch(values.port);
