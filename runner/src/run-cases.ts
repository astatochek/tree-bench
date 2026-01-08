import { pencilAppearsAfterEdit } from "./cases/pencil-appears-after-edit.ts";
import { run } from "./run.ts";
import { sut } from "./sut.ts";

await run(sut, pencilAppearsAfterEdit, { warmup: 5, runs: 20, tree: { width: 10, depth: 6 } });
