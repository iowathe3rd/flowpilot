# Repository Guidelines

## Project Structure & Module Organization

FlowPilot is a `pnpm`/Turbo monorepo. Core library code lives in `packages/core/src`, React bindings live in `packages/react/src`, and both keep tests in `src/__tests__`. Runnable apps sit under `apps/`: `demo` is a Vite showcase with Playwright specs in `apps/demo/e2e`, `docs` is the Next.js documentation site, and `landing` is the marketing site with shared UI in `apps/landing/components` and static assets in `apps/landing/public`. Shared lint and TypeScript presets live in `tooling/eslint-config` and `tooling/tsconfig`.

## Build, Test, and Development Commands

Install once with `pnpm install`. Use `pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm type-check`, and `pnpm test` for workspace-wide runs via Turbo. Target a package or app with filters, for example `pnpm --filter @flowpilot/core test`, `pnpm --filter @flowpilot/react test`, `pnpm --filter demo dev`, or `pnpm --filter landing test:e2e`. Before release work, run `pnpm validate:packages` to enforce type and bundle-size checks.

## Coding Style & Naming Conventions

TypeScript is the default across packages and apps. Prettier defines formatting: 2-space indentation, single quotes, semicolons, trailing commas (`es5`), and `printWidth: 80`; run `pnpm format` or `pnpm format:check`. ESLint extends shared configs from `tooling/eslint-config`; unused variables should be prefixed with `_`. Use `PascalCase` for React components and providers, `camelCase` for hooks and utilities, and kebab-style filenames only where the repository already uses them for engine modules such as `state-machine.ts`.

## Testing Guidelines

Unit and integration tests use Vitest in `packages/core` and `packages/react`; follow the existing `*.test.ts` and `*.test.tsx` pattern inside `src/__tests__`. End-to-end coverage uses Playwright in `apps/demo/e2e` and `apps/landing` via each app’s `test:e2e` script. Add or update tests alongside behavioral changes, especially for orchestration state, hooks, and target resolution.

## Commit & Pull Request Guidelines

Recent history follows Conventional Commits such as `feat: ...` and `feat(landing): ...`; keep that format and use scopes when a change is isolated to one app or package. Pull requests should describe the change, list affected workspaces, mention validation commands run, and include screenshots or recordings for UI changes in `demo`, `docs`, or `landing`. If the change impacts published packages, add a changeset before review.

## Release & Automation Notes

This repo uses Changesets for versioning and `simple-git-hooks` with `lint-staged` on commit. Use `pnpm changeset`, `pnpm version`, and `pnpm release` for package releases, and avoid editing generated `dist` output unless a build step requires regeneration.
