import { type Page } from "playwright";
import { type Context, sut } from "../sut.ts";
import { WSL_LOCALHOST_ALIAS } from "../wsl.ts";
import { run } from "../run.ts";

async function pencilAppearsAfterEdit(page: Page, ctx: Context) {
  await page.goto(`http://${WSL_LOCALHOST_ALIAS}:${ctx.port}`);

  await page.getByTestId(`expand:Node 0-0`).click();
  await page.getByTestId(`expand:Node 1-0`).click();
  await page.getByTestId(`expand:Node 2-0`).click();
  await page.getByTestId(`expand:Node 3-0`).click();

  const node = page.getByTitle("Node 4-0");
  await node.click();

  const input = page.getByTestId("attr 4-0 #2");
  await input.waitFor({ state: "visible" });

  const pencil = page.getByTestId("pencil:Node 4-0");

  const start = performance.now();
  await input.fill("11");

  await pencil.waitFor({ state: "attached" });
  const end = performance.now();
  return end - start;
}

await run(sut, pencilAppearsAfterEdit);

console.log(sut);
