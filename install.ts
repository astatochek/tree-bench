import {$} from "bun"

const green = (text: string) => `\x1b[32m\x1b[1m${text}\x1b[0m`

// Install in runner directory
console.log(green(`Entered dir: runner`))
await $`cd ./runner && bun i`.nothrow();

// Install in each framework subdirectory
const dirs = await $`ls -d ./frameworks/*/ 2>/dev/null || echo ""`.text();
for (const dir of dirs.trim().split('\n').filter(d => d)) {
    console.log(green(`Entered dir: ${dir}`))
    await $`cd ${dir} && bun i`.nothrow();
}
