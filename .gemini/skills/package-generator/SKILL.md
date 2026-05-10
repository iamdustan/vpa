---
name: package-generator
description: Generates new packages or applications in the monorepo with standardized configurations for TypeScript (default) and Rust. Use this skill when asked to create a new library, package, or app.
---

# Package Generator

This skill automates the creation of new packages in the `packages/` or `apps/` directories. It provides a standardized setup for TypeScript and Rust, ensuring integration with Turbo and the workspace's build/test pipelines.

## Usage

To create a new package, use the bundled script:

```bash
node package-generator/scripts/create_package.cjs <name> [ts|rust] [packages|apps]
```

- `<name>`: The name of the package.
- `[ts|rust]`: The language template to use (default: `ts`).
- `[packages|apps]`: The target directory (default: `packages`).

### TypeScript Package Defaults

- **Naming**: Scoped as `@vpa/<name>`.
- **Config**: Extends `@vpa/ts-config/tsconfig.json`.
- **Build**: `tsc` (TypeScript compiler).
- **Test**: `vitest` for unit testing.
- **Lint/Format**: `biome` for static analysis and formatting.
- **Dev**: `vitest` in watch mode.

### Rust Package Defaults

- **Naming**: Uses the provided name directly in `Cargo.toml`.
- **Type**: Standard library (lib.rs) with a basic test module.
- **Integration**: Automatically picked up by the root `Cargo.toml` via `packages/*` glob.

## Integration with Turbo

All generated packages include scripts compatible with the root `turbo.json`:

- `npm run build` -> `turbo run build`
- `npm run test` -> `turbo run test`
- `npm run lint` -> `turbo run lint`
- `npm run format` -> `turbo run format`
- `npm run dev` -> `turbo run dev`

## Prerequisites

Ensure the following tools are available in the workspace:

- **TypeScript**: `npm install -D vitest @biomejs/biome` (if not already at root)
- **Rust**: `cargo` installed on the system.
