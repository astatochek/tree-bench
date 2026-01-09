import type { Page, Route, Request } from "playwright";

export class TreeOptions {
  constructor(
    readonly width: number,
    readonly depth: number,
  ) {}

  getNodeCount(): number {
    if (this.width === 1) {
      return this.depth;
    }

    return (Math.pow(this.width, this.depth) - 1) / (this.width - 1);
  }

  getInfoLine() {
    return `(width=${this.width}, depth=${this.depth}, nodes=${this.getNodeCount()})`;
  }
}

export async function setupMocks(page: Page, options: TreeOptions) {
  const tree = genTree(options.width, options.depth, 0, 0);
  await page.route(
    (url) => url.pathname.includes("api/tree"),
    async (route: Route, request: Request) => {
      await route.fulfill({ json: tree });
    },
  );
}

type TreeNodeJSON = {
  title: string;
  attributes: { title: string; value: string }[];
  children: TreeNodeJSON[];
};

function genTree(width: number, depth: number, level: number, index: number): TreeNodeJSON {
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

//console.log(new TreeOptions(8, 6).getInfoLine())
