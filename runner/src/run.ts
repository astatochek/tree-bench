import { type Context } from "./sut.ts";
import { chromium, type Page } from "playwright";
import { setupMocks, type TreeOptions } from "./mocks.ts";
import { createCPUBenchmarkReport } from "./cpu-report.ts";
import { toBenchmarkResult } from "./stats.ts";
import { createMemoryBenchmarkReport } from "./mem-report.ts";

export type Test = {
  name: string;
  run: (page: Page, tree: TreeOptions) => Promise<number>;
};

export type CPUBenchmarkRunConfig = {
  warmup?: number;
  runs?: number;
  tree: TreeOptions;
};

export async function runCPUBenchmark(
  sut: Context[],
  test: Test,
  { warmup = 5, runs = 10, tree }: CPUBenchmarkRunConfig,
) {
  const browser = await chromium.launch({
    headless: false,
    args: ["--enable-benchmarking"],
  });
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

  createCPUBenchmarkReport(sut.map(toBenchmarkResult), tree, test);
}

export type MemoryBenchmarkRunConfig = { tree: TreeOptions };

export async function runMemoryBenchmark(
  sut: Context[],
  test: Test,
  { tree }: MemoryBenchmarkRunConfig,
) {
  const browser = await chromium.launch({
    headless: false,
    args: [
      "--js-flags=--expose-gc",
      "--enable-precise-memory-info",
      "--enable-experimental-web-platform-features",
      "--disable-web-security",
      "--disable-features=IsolateOrigins,site-per-process",
      "--disable-site-isolation-trials",
      "--enable-features=CrossOriginOpenerPolicyReporting,CrossOriginEmbedderPolicyReporting",
      "--enable-blink-features=MemoryMeasurement",
    ],
  });
  for await (const ctx of sut) {
    const page = await browser.newPage();
    await setupMocks(page, tree);
    await tryRun(async () => {
      await page.goto(`http://${process.env.HOST}:${ctx.port}`);
      const res = await test.run(page, tree);
      ctx.results.push(res);
    }, 1);
    await page.close();
  }

  createMemoryBenchmarkReport(
    sut.map((ctx) => ({ title: ctx.title, memoryUsed: ctx.results[0]! })),
    test,
    tree,
  );
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
