import type { Test } from "../run.ts";
import type { Page } from "playwright";
import type { TreeOptions } from "../mocks.ts";
import { MemoryHarness } from "../harness/memory-harness.ts";

export const traverseTree = {
  name: "Traverse Tree",
  run,
} as const satisfies Test;

async function run(page: Page, tree: TreeOptions) {
  const levels = Array.from(Array(tree.depth - 1).keys());
  const last = {
    level: tree.depth - 1,
    pos: tree.width - 1,
  } as const;

  for await (const level of levels) {
    if (level === 0) {
      await page.getByTestId(`expand:Node 0-0`).click();
    } else {
      await page.getByTestId(`expand:Node ${level}-${last.pos}`).click();
    }
  }

  const node = page.getByTitle(`Node ${last.level}-${last.pos}`);
  await node.click();

  const harness = new MemoryHarness(page);

  await page.waitForTimeout(40);
  await harness.forceGC();
  await page.waitForTimeout(1000);

  const res = await harness.measure();

  return res.mb;
}
