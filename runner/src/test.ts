import { chromium, type Page } from "playwright";
import { setupRoutes } from "./routes.ts";

async function setup() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  await setupRoutes(page);
  return page;
}

type Context = {
  port: number;
  title: string;
  results: number[];
};

async function runExampleTest(page: Page, ctx: Context) {
  await page.goto(`http://host.docker.internal:${ctx.port}`);
  for await (const index of integers(4)) {
    const expand = page.getByTestId(`expand:Node ${index - 1}-0`);
    await expand.click();
  }

  const child1 = page.getByTitle("Node 4-0");
  await child1.click();

  const input = page.locator(
    "body > app-root > main > node-attributes > div > div.overflow-x-auto > table > tbody > tr > td:nth-child(3) > div > input",
  );

  await input.waitFor({ state: "visible" });

  const pencil = page.getByTestId("pencil:Node 4-0");

  const start = performance.now();
  await input.fill("11");

  await pencil.waitFor({ state: "attached" });
  const end = performance.now();
  return end - start;
}

function* integers(max?: number) {
  let i = 1;
  while (true) {
    if (max && i === max + 1) {
      break;
    }
    yield i++;
  }
}

const sut: Context[] = [
  { title: "Angular Signals", port: 3000, results: [] },
  { title: "Angular Pure Pull", port: 3001, results: [] },
];

for await (const ctx of sut) {
  const warmup = 5;
  const runs = 10;

  const page = await setup();

  for await (const _ of integers(warmup)) {
    await runExampleTest(page, ctx);
  }

  for await (const _ of integers(runs)) {
    const res = await runExampleTest(page, ctx);
    ctx.results.push(res);
  }

  await page.close();
}

console.log(sut);
