import type { Page, Route, Request } from "playwright";

export async function setupMocks(page: Page) {
  await page.route(
    (url) => url.pathname.includes("api/tree"),
    async (route: Route, request: Request) => {
      await route.fulfill({
        json: genTree(10, 6, 0, 0),
      });
    },
  );
}

function genTree(width: number, depth: number, level: number, index: number): any {
  const children =
    level === depth - 1
      ? []
      : Array.from(Array(width).keys()).map((index) => genTree(width, depth, level + 1, index));
  return {
    title: `Node ${level}-${index}`,
    attributes: Array.from(Array(3).keys()).map((attrIdx) => ({
      title: `attr ${level}-${index} #${attrIdx + 1}`,
      value: "10",
    })),
    children,
  };
}
