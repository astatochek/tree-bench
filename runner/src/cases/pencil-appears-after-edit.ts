import { type Page } from "playwright";
import { type Context } from "../sut.ts";
import { TimelineHarness } from "../harness/harness.ts";
import type { TreeOptions } from "../mocks.ts";
import type { Test } from "../run.ts";

export const pencilAppearsAfterEdit = {
  name: "Pencil Appears After Edit",
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

  const input = page.getByTestId(`attr ${last.level}-${last.pos} #3`);
  await input.waitFor({ state: "visible" });

  const pencil = page.getByTestId(`pencil:Node ${last.level}-${last.pos}`);

  const harness = new TimelineHarness(page);

  const res = await harness.measureInputToPaint(async () => {
    await input.fill("11");
    await pencil.waitFor({ state: "visible" });
  });

  return res.durationMillis;
}
