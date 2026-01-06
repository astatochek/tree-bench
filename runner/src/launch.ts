import { chromium } from "playwright";
import { setupRoutes } from "./routes.ts";

export async function launch(port: number) {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  await setupRoutes(page);
  // for WSL
  await page.goto(`http://host.docker.internal:${port}`);
}

await launch(3000);
