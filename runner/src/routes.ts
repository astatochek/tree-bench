import type { Page, Route, Request } from "playwright";

export async function setupRoutes(page: Page) {
  await page.route(
    (url) => url.pathname.includes("api/tree"),
    async (route: Route, request: Request) => {
      await route.fulfill({
        json: {
          title: "Root Node 1",
          attributes: [{ title: "attr1", value: "10" }],
          children: [
            {
              title: "Child 1.1",
              attributes: [{ title: "attr1.1", value: "10" }],
              children: [
                {
                  title: "Grandchild 1.1.1",
                  children: [],
                },
              ],
            },
            {
              title: "Child 1.2",
              children: [],
            },
          ],
        },
      });
    },
  );
}
