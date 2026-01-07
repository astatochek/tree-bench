import { type Context } from "./sut.ts";
import { chromium, type Page } from "playwright";
import { setupMocks } from "./mocks.ts";
import { report } from "./report.ts";

export type Test = (page: Page, ctx: Context) => Promise<number>;

export type RunConfig = {
  warmup?: number;
  runs?: number;
};

export async function run(sut: Context[], test: Test, { warmup = 5, runs = 10 }: RunConfig = {}) {
  const browser = await chromium.launch({ headless: false });
  for await (const ctx of sut) {
    const page = await browser.newPage();
    await setupMocks(page);

    await tryRun(async () => {
      await page.goto(`http://${process.env.HOST}:${ctx.port}`);
      await test(page, ctx);
    }, warmup);

    await tryRun(async () => {
      await page.goto(`http://${process.env.HOST}:${ctx.port}`);
      const res = await test(page, ctx);
      ctx.results.push(res);
    }, runs);

    report(ctx);

    await page.close();
  }
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

async function setup() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  await setupMocks(page);
  return page;
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
