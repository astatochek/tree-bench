import type { BenchmarkResult, ConfidenceInterval } from "./stats.ts";
import type { TreeOptions } from "./mocks.ts";
import type { Test } from "./run.ts";

function formatTime(time: number, decimals: number = 2): string {
  return time.toFixed(decimals);
}

function formatConfidenceInterval(ci: ConfidenceInterval, decimals: number = 2): string {
  return `[${ci.lower.toFixed(decimals)} - ${ci.upper.toFixed(decimals)}]`;
}

function formatMeanWithStd(mean: number, stdDev: number, decimals: number = 2): string {
  return `${formatTime(mean, decimals)} ± ${formatTime(stdDev, decimals)}`;
}

export function createCPUBenchmarkReport(
  results: BenchmarkResult[],
  tree: TreeOptions,
  test: Test,
): void {
  // Sort by mean performance (fastest first)
  const sortedResults = [...results].sort((a, b) => a.stats.mean - b.stats.mean);

  // Find the fastest for relative comparison
  const fastestMean = sortedResults[0]!.stats.mean;

  console.log("\n" + "=".repeat(80));
  console.log(`📊 ${test.name} ${tree.getInfoLine()}`);
  console.log("=".repeat(80));

  // Main table with key metrics
  console.log("\n📈 PERFORMANCE METRICS (sorted by performance):");
  console.log("-".repeat(80));

  const tableData = sortedResults.map((result, index) => {
    const { stats } = result;
    const relativeToFastest = ((stats.mean / fastestMean - 1) * 100).toFixed(1);

    return {
      Rank: index + 1,
      Framework: result.title,
      "Mean ± Std": formatMeanWithStd(stats.mean, stats.stdDev),
      Median: formatTime(stats.median),
      Min: formatTime(stats.min),
      Max: formatTime(stats.max),
      "95% CI": formatConfidenceInterval(stats.confidenceInterval),
      "Rel to Fastest": index === 0 ? "→ Fastest" : `+${relativeToFastest}%`,
      Runs: stats.count,
      "StdDev %": `${stats.relativeStdDev.toFixed(1)}%`,
    };
  });

  // Display as table
  console.table(tableData);

  // Additional summary section
  console.log("\n🔍 CONFIDENCE INTERVAL ANALYSIS (95%):");
  console.log("-".repeat(80));

  sortedResults.forEach((result) => {
    const ci = result.stats.confidenceInterval;
    const ciWidth = ci.upper - ci.lower;
    const ciCenter = (ci.upper + ci.lower) / 2;

    console.log(
      `${result.title.padEnd(20)}: ${formatTime(ciCenter)} ± ${formatTime(ciWidth / 2, 3)}`,
    );
  });

  // Statistical significance analysis
  console.log("\n📊 STATISTICAL SIGNIFICANCE:");
  console.log("-".repeat(80));

  if (sortedResults.length > 1) {
    const fastest = sortedResults[0]!;
    const second = sortedResults[1]!;

    // Check if confidence intervals overlap
    const fastestCI = fastest.stats.confidenceInterval;
    const secondCI = second.stats.confidenceInterval;

    const noOverlap = fastestCI.upper < secondCI.lower;
    const overlapPercentage = noOverlap
      ? 0
      : ((Math.min(fastestCI.upper, secondCI.upper) - Math.max(fastestCI.lower, secondCI.lower)) /
          (Math.max(fastestCI.upper, secondCI.upper) - Math.min(fastestCI.lower, secondCI.lower))) *
        100;

    console.log(`Fastest: ${fastest.title}`);
    console.log(
      `Second: ${second.title} (${((second.stats.mean / fastest.stats.mean - 1) * 100).toFixed(1)}% slower)`,
    );
    console.log(
      `Confidence Intervals ${noOverlap ? "DO NOT overlap" : `overlap by ${overlapPercentage.toFixed(1)}%`}`,
    );
    console.log(
      noOverlap
        ? "✅ Difference is statistically significant"
        : "⚠️  Difference may not be statistically significant",
    );
  }

  console.log("\n" + "=".repeat(80));
  console.log("Note: All times in milliseconds, sorted by mean (lower is better)");
  console.log("=".repeat(80));
}
