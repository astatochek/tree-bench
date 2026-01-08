import { json, error } from "@sveltejs/kit";
import { dev } from "$app/environment";

export async function GET() {
  if (dev) {
    return json(genTree(5, 5, 0, 0));
  }
  return error(403);
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
