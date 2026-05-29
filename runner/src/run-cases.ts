import { pencilAppearsOnEditedNodeAfterEdit } from "./cpu-cases/pencil-appears-on-edited-node-after-edit.ts";
import { runCPUBenchmark, runMemoryBenchmark } from "./run.ts";
import { sut } from "./sut.ts";
import { traverseTree } from "./mem-cases/traverse-tree.ts";
import { ExponentialTreeOptions, MultiplicativeTreeOptions } from "./mocks.ts";
import { pencilAppearsOnCollapsedRootAfterEdit } from "./cpu-cases/pencil-appears-on-collapsed-root-after-edit.ts";
import { pencilDisappearsFromCollapsedRootOnClear } from "./cpu-cases/pencil-disappears-from-collapsed-root-on-clear.ts";
import { pencilDisappearsFromSelectedNodeOnClear } from "./cpu-cases/pencil-disappears-from-selected-node-on-clear.ts";

/**
 * (width=4, depth=10, nodes=349525)
 * (width=8, depth=7, nodes=299593)
 * (width=10, depth=6, nodes=111111)
 * (width=10, depth=5, nodes=11111)
 * (width=9, depth=6, nodes=66430)
 * (width=8, depth=6, nodes=37449)
 */
const Exponential = {
  COUNT_350_000: new ExponentialTreeOptions(4, 10, 3),
  COUNT_300_000: new ExponentialTreeOptions(8, 7, 3),
  COUNT_100_000: new ExponentialTreeOptions(10, 6, 3),
  COUNT_60_000: new ExponentialTreeOptions(9, 6, 3),
  COUNT_40_000: new ExponentialTreeOptions(9, 6, 3),
  COUNT_10_000: new ExponentialTreeOptions(10, 5, 3),
} as const;

const Multiplicative = {
  COUNT_50_000: new MultiplicativeTreeOptions(10_000, 5, 3),
  COUNT_200_000: new MultiplicativeTreeOptions(10_000, 20, 3),
} as const;

//await runCPUBenchmark(sut, pencilAppearsAfterEdit, {
//  warmup: 5,
//  runs: 30,
//  tree: COUNT_10_000,
//});

//await runCPUBenchmark(sut, pencilAppearsOnEditedNodeAfterEdit, {
//  warmup: 2,
//  runs: 50,
//  silent: false,
//  tree: new ExponentialTreeOptions(10, 5, 128),
//});

await runMemoryBenchmark(sut, traverseTree, { tree: new ExponentialTreeOptions(4, 10, 3) });
