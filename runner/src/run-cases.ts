import { pencilAppearsAfterEdit } from "./cpu-cases/pencil-appears-after-edit.ts";
import { runCPUBenchmark, runMemoryBenchmark } from "./run.ts";
import { sut } from "./sut.ts";
import { traverseTree } from "./mem-cases/traverse-tree.ts";

//await runCPUBenchmark(sut, pencilAppearsAfterEdit, {
//  warmup: 5,
//  runs: 30,
//  tree: { width: 10, depth: 5 },
//});

await runMemoryBenchmark(sut, traverseTree, { tree: { width: 8, depth: 7 } });
