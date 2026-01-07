import { type Page } from "playwright";
import { type Context, sut } from "../sut.ts";
import { WSL_LOCALHOST_ALIAS } from "../wsl.ts";
import { run } from "../run.ts";
import { report } from "../report.ts";
import { TimelineHarness } from "../harness/harness.ts";

async function pencilAppearsAfterEdit(page: Page, ctx: Context) {
  await page.goto(`http://${WSL_LOCALHOST_ALIAS}:${ctx.port}`);

  await page.getByTestId(`expand:Node 0-0`).click();
  await page.getByTestId(`expand:Node 1-9`).click();
  await page.getByTestId(`expand:Node 2-9`).click();
  await page.getByTestId(`expand:Node 3-9`).click();

  const node = page.getByTitle("Node 4-9");
  await node.click();

  const input = page.getByTestId("attr 4-9 #3");
  await input.waitFor({ state: "visible" });

  const pencil = page.getByTestId("pencil:Node 4-9");

  const harness = new TimelineHarness(page);

  const res = await harness.measureInputToPaint(async () => {
    await input.fill("11");
    await pencil.waitFor({ state: "visible" });
  });

  return res.durationMillis;
}
await run(sut, pencilAppearsAfterEdit, { warmup: 5, runs: 10 });

sut.map(report);
