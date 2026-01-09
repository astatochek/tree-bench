import { pencilAppearsAfterEdit } from "./cpu-cases/pencil-appears-after-edit.ts";
import { runCPUBenchmark, runMemoryBenchmark } from "./run.ts";
import { sut } from "./sut.ts";
import { traverseTree } from "./mem-cases/traverse-tree.ts";
import { TreeOptions } from "./mocks.ts";
import { pencilAppearsOnCollapsedRootAfterEdit } from "./cpu-cases/pencil-appears-on-collapsed-root-after-edit.ts";

/**
 * (width=4, depth=10, nodes=349525)
 * (width=8, depth=7, nodes=299593)
 * (width=10, depth=6, nodes=111111)
 * (width=10, depth=5, nodes=11111)
 * (width=9, depth=6, nodes=66430)
 * (width=8, depth=6, nodes=37449)
 */

const COUNT_350_000 = new TreeOptions(4, 10);
const COUNT_300_000 = new TreeOptions(8, 7);
const COUNT_100_000 = new TreeOptions(10, 6);
const COUNT_60_000 = new TreeOptions(9, 6);
const COUNT_40_000 = new TreeOptions(9, 6);
const COUNT_10_000 = new TreeOptions(10, 5);

//await runCPUBenchmark(sut, pencilAppearsAfterEdit, {
//  warmup: 5,
//  runs: 30,
//  tree: COUNT_10_000,
//});

await runCPUBenchmark(sut, pencilAppearsOnCollapsedRootAfterEdit, {
  warmup: 5,
  runs: 20,
  silent: true,
  tree: COUNT_300_000,
});

//await runMemoryBenchmark(sut, traverseTree, { tree: COUNT_300_000 });
