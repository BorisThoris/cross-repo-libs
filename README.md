# cross-repo-libs

Personal **npm workspaces monorepo** for reusable packages shared across your desktop apps (see also `CROSS-REPO-LIBRARY-SCAN.md` in the parent `Repos` folder).

## Contents

| Path | Purpose |
|------|---------|
| [`references/MusicalAppReactConcept`](references/MusicalAppReactConcept) | **Git submodule** — upstream musical / DAW React app used as the design reference and source for extracted utilities. |
| [`packages/notifications`](packages/notifications) | Toast + confirm stack: Zustand store, imperative `notify*` bridge, accessible DOM host (CSS variables, no styled-components / i18n required). |
| [`apps/example-web`](apps/example-web) | Minimal Vite + React page to exercise the notifications package. |

## Submodule

After cloning this repo:

```bash
git submodule update --init --recursive
```

## Scripts (repo root)

| Command | Description |
|---------|-------------|
| `npm install` | Install all workspace dependencies. |
| `npm test` | Run Vitest across packages. |
| `npm run build` | Build every workspace that defines a `build` script (currently `@cross-repo-libs/notifications`). |
| `npm run example:dev` | Start the Vite demo (`apps/example-web`, port **5179**). |
| `npm run lint` | ESLint on this monorepo (submodule under `references/` is ignored). |

## Adding another package

1. Create `packages/<name>/` with its own `package.json` (scoped name like `@cross-repo-libs/<name>` is consistent).
2. Add `"build"` if the package ships compiled output.
3. Re-run `npm install` at the root so workspaces link.

## Consuming `@cross-repo-libs/notifications` from another repo

- **Published npm:** configure your registry and depend on the version you publish.
- **Local file link:** in the consumer `package.json`: `"@cross-repo-libs/notifications": "file:../cross-repo-libs/packages/notifications"` then install.
- **Theme:** import optional stylesheet `import '@cross-repo-libs/notifications/styles.css'` (same as bundled default classes) and override `--crn-*` variables documented in `packages/notifications/src/notification-host.css`.
