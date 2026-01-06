import { sut } from "./sut.ts";

const pool: Bun.Subprocess[] = [];

sut.forEach((ctx) => {
  console.log("Started script for:", ctx.title);
  const proc = Bun.spawn(["bun", "run", "./serve.ts", "--port", `${ctx.port}`], {
    cwd: `../frameworks/${ctx.dir}`,
    stdout: "pipe",
    stderr: "pipe",
  });

  pipeToConsole(proc.stdout.getReader(), "log");
  pipeToConsole(proc.stderr.getReader(), "error");

  pool.push(proc);
});

async function pipeToConsole(
  reader: import("node:stream/web").ReadableStreamDefaultReader<Uint8Array<ArrayBuffer>>,
  method: Extract<keyof typeof console, "log" | "error">,
) {
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const text = new TextDecoder().decode(value);
    console[method](text);
  }
}
