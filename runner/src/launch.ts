import { chromium } from "playwright";
import { parseArgs } from "util";
import { WSL_LOCALHOST_ALIAS } from "./wsl.ts";
import { setupMocks } from "./mocks.ts";

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
  await setupMocks(page);
  await page.goto(`http://${WSL_LOCALHOST_ALIAS}:${port}`);
}

await launch(values.port);
