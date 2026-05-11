import type { Page, Route, Request } from "playwright";

export type TreeOptions = {
  readonly width: number;
  readonly depth: number;
  readonly attributes: number;

  getInfoLine(): string;
  genTree(): TreeNodeJSON;
};

export class ExponentialTreeOptions implements TreeOptions {
  readonly width: number;
  readonly depth: number;
  readonly attributes: number;
  constructor(width: number, depth: number, attributes: number) {
    this.width = width;
    this.depth = depth;
    this.attributes = attributes;
  }

  getNodeCount(): number {
    if (this.width === 1) {
      return this.depth;
    }

    return (Math.pow(this.width, this.depth) - 1) / (this.width - 1);
  }

  getInfoLine() {
    return `(width=${this.width}, depth=${this.depth}, nodes=${this.getNodeCount()}, attrs=${this.getNodeCount() * this.attributes})`;
  }

  genTree(): TreeNodeJSON {
    const rec = (level: number, index: number): TreeNodeJSON => {
      const children =
        level === this.depth - 1
          ? []
          : Array.from(Array(this.width).keys()).map((index) => rec(level + 1, index));
      return {
        title: `Node ${level}-${index}`,
        attributes: Array.from(Array(this.attributes).keys()).map((attrIdx) => ({
          title: `attr ${level}-${index} #${attrIdx + 1}`,
          value: "10",
        })),
        children,
      };
    };
    return rec(0, 0);
  }
}

export class MultiplicativeTreeOptions implements TreeOptions {
  readonly width: number;
  readonly depth: number;
  readonly attributes: number;
  constructor(width: number, depth: number, attributes: number) {
    this.width = width;
    this.depth = depth;
    this.attributes = attributes;
  }

  getNodeCount(): number {
    return 1 + this.width * this.depth;
  }

  getInfoLine() {
    return `(width=${this.width}, depth=${this.depth}, nodes=${this.getNodeCount()}, attrs=${this.getNodeCount() * this.attributes})`;
  }

  genTree(): TreeNodeJSON {
    // Inner helper to handle recursion with level and index
    const buildNode = (level: number, index: number): TreeNodeJSON => {
      let children: TreeNodeJSON[] = [];

      // 1. Level 0 (Root) always branches out.
      // 2. For other levels, only the last child (index === width - 1) branches out.
      // 3. Stop once we reach the specified depth.
      const isRoot = level === 0;
      const isLastChild = index === this.width - 1;

      if (level < this.depth && (isRoot || isLastChild)) {
        children = Array.from({ length: this.width }).map((_, i) => buildNode(level + 1, i));
      }

      return {
        title: `Node ${level}-${index}`,
        attributes: Array.from({ length: this.attributes }).map((_, attrIdx) => ({
          title: `attr ${level}-${index} #${attrIdx + 1}`,
          value: "10",
        })),
        children,
      };
    };

    return buildNode(0, 0);
  }
}

export async function setupMocks(page: Page, options: TreeOptions) {
  const tree = options.genTree();
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

//console.log(new TreeOptions(8, 6).getInfoLine())
