import { type Context } from "./sut.ts";
import { chromium, type Page } from "playwright";
import { setupMocks } from "./mocks.ts";

export type Test = (page: Page, ctx: Context) => Promise<number>;

export type RunConfig = {
  warmup?: number;
  runs?: number;
};

export async function run(sut: Context[], test: Test, { warmup = 5, runs = 10 }: RunConfig = {}) {
  for await (const ctx of sut) {
    const page = await setup();

    for await (const _ of integers(warmup)) {
      await test(page, ctx);
    }

    for await (const _ of integers(runs)) {
      const res = await test(page, ctx);
      ctx.results.push(res);
    }

    await page.close();
  }
}

async function setup() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  await setupMocks(page);
  return page;
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
