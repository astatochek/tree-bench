import { launch } from "./launch.ts";

const frameworks = ["angular-signals"];

const pool: Bun.Subprocess[] = [];

let port = 3000;
frameworks.forEach(async (framework) => {
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

async function log(reader: ReadableStreamDefaultReader): void {
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const text = new TextDecoder().decode(value);
    console.log(text);
  }
}
