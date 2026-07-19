# Repository Guidelines

## Project Structure & Module Organization
This is a Vue 2 + TypeScript + Electron application. Core UI screens live in `src/views/`, shared UI pieces in `src/components/`, and app state in `src/store/`. Utility code is grouped under `src/store/util/`, API wrappers under `src/api/`, and static content under `public/`. Electron entry points are in `electron/`. Unit tests live in `tests/unit/`.

## Build, Test, and Development Commands
Use Yarn for local work:

- `yarn install` - install dependencies.
- `yarn serve` - start the Vue dev server with hot reload.
- `yarn build` - compile and minify the production web bundle.
- `yarn test:unit` - run Jest unit tests.
- `yarn lint` - run ESLint and apply the repo’s lint checks.
- `yarn start` - launch the Electron app from the built code.
- `yarn dist` - package the desktop app with `electron-builder`.

## Coding Style & Naming Conventions
The repo follows the Vue CLI ESLint stack (`plugin:vue/essential`, `@vue/standard`, `@vue/typescript/recommended`). Use 2-space indentation, semicolons omitted, and `camelCase` for variables/functions. Vue components use `PascalCase` filenames, such as `History.vue`. Keep store modules and utility files descriptive, e.g. `src/store/util/Database.ts`. Prefer small, focused edits that match the existing class-style Vue and TypeScript patterns.

## Testing Guidelines
Tests use Jest with Vue Test Utils. Place specs in `tests/unit/` and name them `*.spec.ts`. Follow the local pattern of shallow-mounted component tests for UI behavior and keep assertions narrow. Run `yarn test:unit` before opening a PR when touching shared logic or views.

## Commit & Pull Request Guidelines
Recent history mixes conventional prefixes like `feat:`, `fix:`, and `docs:` with short Chinese summaries. Keep commit messages concise and task-oriented. For pull requests, include a clear description of the change, the affected screens or modules, and screenshots or screen recordings when the UI changes. Link related issues when available.

## Security & Configuration Tips
Application data is stored locally in IndexedDB; avoid introducing code that assumes server-side persistence. Be careful with files under `public/static/`, which are used as bundled app resources and should stay compatible with the Electron packaging flow.
