import { pencilAppearsAfterEdit } from "./cases/case-1";
import { run } from "./run.ts";
import { sut } from "./sut.ts";

await run(sut, pencilAppearsAfterEdit, { warmup: 5, runs: 10 });
