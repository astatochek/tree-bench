import type { Context } from "./sut.ts";

export interface BenchmarkResult {
  title: string;
  stats: BenchmarkStats;
}

export function toBenchmarkResult(ctx: Context): BenchmarkResult {
  return {
    title: ctx.title,
    stats: calculateStats(ctx.results),
  };
}

export interface ConfidenceInterval {
  lower: number;
  upper: number;
  level: number;
}

export interface BenchmarkStats {
  mean: number;
  median: number;
  min: number;
  max: number;
  stdDev: number;
  variance: number;
  count: number;
  p95: number;
  p99: number;
  confidenceInterval: ConfidenceInterval;
  relativeStdDev: number; // Coefficient of variation
}

export function calculateStats(runs: number[], confidenceLevel = 0.95): BenchmarkStats {
  if (runs.length === 0) {
    throw new Error("No data provided for statistics");
  }

  const sorted = [...runs].sort((a, b) => a - b);
  const count = runs.length;

  // Basic statistics
  const mean = runs.reduce((sum, val) => sum + val, 0) / count;
  const median = calculateMedian(sorted);
  const min = sorted[0]!;
  const max = sorted[sorted.length - 1]!;

  // Variance and standard deviation
  const variance = calculateVariance(runs, mean);
  const stdDev = Math.sqrt(variance);
  const relativeStdDev = (stdDev / mean) * 100; // Coefficient of variation

  // Percentiles
  const p95 = calculatePercentile(sorted, 95);
  const p99 = calculatePercentile(sorted, 99);

  // Confidence interval (t-distribution for small samples)
  const confidenceInterval = calculateConfidenceInterval(runs, mean, stdDev, confidenceLevel);

  return {
    mean,
    median,
    min,
    max,
    stdDev,
    variance,
    count,
    p95,
    p99,
    confidenceInterval,
    relativeStdDev,
  };
}

function calculateMedian(sorted: number[]): number {
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1]! + sorted[mid]!) / 2 : sorted[mid]!;
}

function calculateVariance(data: number[], mean: number): number {
  return data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length;
}

function calculatePercentile(sorted: number[], percentile: number): number {
  const index = (percentile / 100) * (sorted.length - 1);
  const lowerIndex = Math.floor(index);
  const upperIndex = Math.ceil(index);

  if (lowerIndex === upperIndex) {
    return sorted[lowerIndex]!;
  }

  // Linear interpolation
  const lowerValue = sorted[lowerIndex]!;
  const upperValue = sorted[upperIndex]!;
  const weight = index - lowerIndex;

  return lowerValue + (upperValue - lowerValue) * weight;
}

function calculateConfidenceInterval(
  data: number[],
  mean: number,
  stdDev: number,
  confidenceLevel: number,
): { lower: number; upper: number; level: number } {
  const n = data.length;

  if (n <= 1) {
    return { lower: mean, upper: mean, level: confidenceLevel };
  }

  // Use t-distribution for small samples (< 30), normal for larger
  let criticalValue: number;

  if (n < 30) {
    // For simplicity, using approximate t-values for common confidence levels
    const tValues: Record<number, number> = {
      0.9: 1.645,
      0.95: 1.96,
      0.99: 2.576,
    };
    criticalValue = tValues[confidenceLevel] || 1.96;
  } else {
    // For larger samples, use z-values
    const zValues: Record<number, number> = {
      0.9: 1.645,
      0.95: 1.96,
      0.99: 2.576,
    };
    criticalValue = zValues[confidenceLevel] || 1.96;
  }

  const marginOfError = criticalValue * (stdDev / Math.sqrt(n));

  return {
    lower: mean - marginOfError,
    upper: mean + marginOfError,
    level: confidenceLevel,
  };
}
