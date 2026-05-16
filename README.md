# cross-repo-libs

Personal **npm workspaces monorepo** for reusable packages shared across your desktop apps (see also `CROSS-REPO-LIBRARY-SCAN.md` in the parent `Repos` folder).

## Contents

| Path | Purpose |
|------|---------|
| [`references/MusicalAppReactConcept`](references/MusicalAppReactConcept) | **Git submodule** — upstream musical / DAW React app used as the design reference and source for extracted utilities. |
| [`packages/notifications`](packages/notifications) | Toast + confirm stack: Zustand store, imperative `notify*` bridge, accessible DOM host (CSS variables, no styled-components / i18n required). |
| [`packages/ai-common`](packages/ai-common) | Shared helpers for local AI generation CLIs. |
| [`packages/ai-image`](packages/ai-image) | OpenAI Images and local SDXL image generation helpers. |
| [`packages/ai-music`](packages/ai-music) | Local ACE-Step music/audio generation runners. |
| [`packages/ai-3d`](packages/ai-3d) | SDXL + Hunyuan3D/procedural asset generation helpers. |
| [`packages/ai-refinement`](packages/ai-refinement) | Strong/local model routing policy for project-refinement agents. |
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
| `npm run build` | Build every workspace that defines a `build` script, including the example app. |
| `npm run example:dev` | Start the Vite demo (`apps/example-web`, port **5179**). |
| `npm run lint` | ESLint on this monorepo (submodule under `references/` is ignored). |

## Demo run

```bash
npm install
npm run build
npm run preview --workspace=example-web -- --host 127.0.0.1 --port 4105
```

Open `http://127.0.0.1:4105/`. For live development, `npm run example:dev` starts the same Vite app on its configured port `5179`. The demo app lives in `apps/example-web` and exercises the local workspace packages through Vite aliases.

## Adding another package

1. Create `packages/<name>/` with its own `package.json` (scoped name like `@cross-repo-libs/<name>` is consistent).
2. Add `"build"` if the package ships compiled output.
3. Re-run `npm install` at the root so workspaces link.

## Consuming `@cross-repo-libs/notifications` from another repo

- **Published npm:** configure your registry and depend on the version you publish.
- **Local file link:** in the consumer `package.json`: `"@cross-repo-libs/notifications": "file:../cross-repo-libs/packages/notifications"` then install.
- **Theme:** import optional stylesheet `import '@cross-repo-libs/notifications/styles.css'` (same as bundled default classes) and override `--crn-*` variables documented in `packages/notifications/src/notification-host.css`.

## Cloudflare Pages

Deploy the example web app from the monorepo root so workspace packages resolve normally.

- Pages project name: `cross-repo-libs`
- GitHub repository: `BorisThoris/cross-repo-libs`
- Production branch: `master`
- Root directory: `.`
- Build command: `npm run build`
- Build output directory: `apps/example-web/dist`
- Environment variable: `NODE_VERSION=22.16.0`
- Public URL target: `https://cross-repo-libs.pages.dev/`

Do not enable Cloudflare Access for the demo deployment. Leave frame-blocking headers unset so the portfolio can iframe the public build. Preserve local dirty package work when preparing commits.
