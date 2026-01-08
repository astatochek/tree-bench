import { type Context } from "./sut.ts";
import { chromium, type Page } from "playwright";
import { setupMocks, type TreeOptions } from "./mocks.ts";
import { createBenchmarkReport } from "./report.ts";
import { toBenchmarkResult } from "./stats.ts";

export type Test = {
  name: string;
  run: (page: Page, tree: TreeOptions) => Promise<number>;
};

export type RunConfig = {
  warmup?: number;
  runs?: number;
  tree: TreeOptions;
};

export async function run(sut: Context[], test: Test, { warmup = 5, runs = 10, tree }: RunConfig) {
  const browser = await chromium.launch({ headless: false });
  for await (const ctx of sut) {
    const page = await browser.newPage();
    await setupMocks(page, tree);

    await tryRun(async () => {
      await page.goto(`http://${process.env.HOST}:${ctx.port}`);
      await test.run(page, tree);
    }, warmup);

    await tryRun(async () => {
      await page.goto(`http://${process.env.HOST}:${ctx.port}`);
      const res = await test.run(page, tree);
      ctx.results.push(res);
    }, runs);

    await page.close();
  }

  createBenchmarkReport(sut.map(toBenchmarkResult), tree, test);
}

async function tryRun(fn: () => Promise<unknown>, times: number) {
  let count = 0;
  for await (const _ of integers()) {
    if (count >= times) {
      break;
    }
    try {
      await fn();
      count++;
    } catch (error: unknown) {
      console.error(`Failed run #${count};`);
      console.error(error);
    }
  }
}

function* integers(max = Number.MAX_SAFE_INTEGER - 1) {
  let i = 1;
  while (true) {
    if (i >= max + 1) {
      break;
    }
    yield i++;
  }
}
