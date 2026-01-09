# Tree Bench

A benchmark suite exploring different approaches to implementing reactive tree data structures across various JavaScript frameworks and architectures.

## 🎯 Overview

This project implements a tree data structure with reactive behavior across multiple frontend frameworks. Each implementation demonstrates how different frameworks handle:

- Tree node selection
- Reactive updates to node properties
- Visual indicators for edited nodes
- Cross-framework consistency in behavior

### Core Behavior

- **Node Selection**: Clicking a tree node displays an editable table of its properties
- **Edit Indicators**:
  - ✏️ Pencil icon appears on nodes when their properties are edited
  - Expanded nodes show pencil only if their own attributes are edited
  - Collapsed nodes show pencil if any nested child's attributes are edited
- **Reactive Updates**: All frameworks implement the same reactive behavior patterns

## 🏗️ Project Structure

```
tree-bench/
├── frameworks/          # Individual framework implementations
│   ├── react-push/          # React implementation
│   ├── vue-push/            # Vue implementation
│   ├── svelte-signals/         # Svelte implementation
│   └── ...             # Other frameworks
├── runner/             # Benchmark runner and test suite
│   ├── src/
│   │   ├── sut.ts      # System Under Test configuration
│   │   └── run-cases.ts # Test case definitions
│   ├── package.json
│   └── .env              # Environment configuration files
└── package.json        # Root package.json with workspace config
```

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (version 1.3)
- Playwright Chromium (for benchmark runner)

### Installation

1. **Install dependencies for all frameworks adn runner:**

```bash
bun install:all
```

2. **Install Playwright Chromium (required for benchmark runner):**

```bash
cd runner
bunx playwright install chromium
```

### Configuration

1. **Update host configuration** (if needed):
   - If all processes run on the same OS, change `HOST` to `localhost` in all `.env` files
   - Default setup uses cross Windows-WSL configuration

2. **Configure tested frameworks:**
   Edit `runner/src/sut.ts` to add/remove frameworks from benchmark runs.

## 📊 Running Benchmarks

### Start All Framework Servers

```bash
bun serve:all
```

Spins up production servers for each framework implementation in the `frameworks/` directory.

### Run Benchmark Tests (WSL)

```bash
bun cases:wsl
```

Runs test cases defined in `runner/src/run-cases.ts` and outputs results to console.

> **Note**: The command is named `cases:wsl` because Playwright works on WSL on the maintainer's machine. If Playwright works on your OS, you can modify the host configuration.

## 🔧 Framework Configuration

To include/exclude frameworks from benchmark runs, edit `runner/src/sut.ts`:

```typescript
// Example sut.ts configuration
export const sut: Context[] = [
  { title: "Angular Signals", dir: "angular-signals", port: 3000, results: [] },
  { title: "React Push", dir: "react-push", port: 3004, results: [] },
  { title: "Solid Signals", dir: "solid-signals", port: 3006, results: [] },
  // Add or remove frameworks here
];
```

## 🧪 Test Cases

Benchmark tests verify:

1. Pencil appearing after an edit
2. Memory usage for storing the tree

## 🛠️ Development

### Adding a New Framework

1. Create a new directory in `frameworks/`
2. Implement the tree component with the specified behavior (note the `data-testid` used in tests)
3. Add framework configuration to `runner/src/sut.ts`
4. Update `.env` files if needed

## 📝 Notes

- All framework implementations must maintain identical UI/UX behavior
- Benchmark measurements focus on reactivity performance, not styling
- The runner uses Playwright for consistent cross-framework testing
- Results are printed to console in a comparative format
