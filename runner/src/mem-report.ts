import type { TreeOptions } from "./mocks.ts";
import type { Test } from "./run.ts";

export function createMemoryBenchmarkReport(
  results: MemoryBenchmark[],
  test: Test,
  tree: TreeOptions,
): void {
  // Sort by memory usage (lower is better)
  const sortedResults = [...results].sort((a, b) => a.memoryUsed - b.memoryUsed);
  const bestMemory = sortedResults[0]!.memoryUsed;

  console.log("\n" + "=".repeat(70));
  console.log(`💾 ${test.name} (depth=${tree.width}, depth=${tree.depth})`);
  console.log("=".repeat(70));

  console.log("\n📊 MEMORY CONSUMPTION (sorted by memory usage, lower is better):");
  console.log("-".repeat(70));

  const tableData = sortedResults.map((result, index) => {
    const isBest = index === 0;

    return {
      Rank: index + 1,
      Framework: result.title,
      "Memory Used": formatMemory(result.memoryUsed),
      Comparison: isBest
        ? "→ Most Efficient"
        : formatMemoryComparison(result.memoryUsed, bestMemory),
    };
  });

  console.table(tableData);
}

interface MemoryBenchmark {
  title: string;
  memoryUsed: number; // in MB
}

function formatMemory(mb: number, decimals: number = 2): string {
  if (mb >= 1024) {
    return `${(mb / 1024).toFixed(decimals)} GB`;
  }
  return `${mb.toFixed(decimals)} MB`;
}

function formatMemoryComparison(value: number, bestValue: number): string {
  const difference = value - bestValue;
  const percentage = ((difference / bestValue) * 100).toFixed(1);

  if (Math.abs(difference) < 0.01) {
    return "→ Best";
  }

  const sign = difference > 0 ? "+" : "";
  return `${sign}${difference.toFixed(2)} MB (${sign}${percentage}%)`;
}
