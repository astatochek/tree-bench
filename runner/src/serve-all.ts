const frameworks = ["angular-signals", "angular-pull"];

const pool: Bun.Subprocess[] = [];

let port = 3000;
frameworks.forEach((framework) => {
  console.log("Started script for:", framework);
  const proc = Bun.spawn(["bun", "run", "./serve.ts", "--port", `${port}`], {
    cwd: `../frameworks/${framework}`,
    stdout: "pipe",
    stderr: "pipe",
  });

  const stdout = proc.stdout.getReader();

  log(stdout);

  pool.push(proc);
  port += 1;
});

async function log(
  reader: import("node:stream/web").ReadableStreamDefaultReader<Uint8Array<ArrayBuffer>>,
) {
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const text = new TextDecoder().decode(value);
    console.log(text);
  }
}
