import { type Context } from "./sut.ts";
import { chromium, type Page } from "playwright";
import { setupMocks } from "./mocks.ts";

export type Test = (page: Page, ctx: Context) => Promise<number>;

export type RunConfig = {
  warmup?: number;
  runs?: number;
};

export async function run(sut: Context[], test: Test, { runs = 10 }: RunConfig = {}) {
  for await (const ctx of sut) {
    await tryRun(async () => {
      const page = await setup();
      const res = await test(page, ctx);
      ctx.results.push(res);
      await page.close();
    }, runs);
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
