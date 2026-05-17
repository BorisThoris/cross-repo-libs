# cross-repo-libs

Public custom component Storybook and npm workspaces monorepo for reusable React UI, React Three Fiber primitives, notifications, and local AI helper packages shared across desktop apps.

## Contents

| Path | Purpose |
|------|---------|
| [`apps/example-web`](apps/example-web) | Public custom Storybook-style Vite app for browsing component stories, variants, docs, and live previews. |
| [`packages/react-ui`](packages/react-ui) | Reusable React UI components: buttons, display titles, callouts, panels, cards, preview cards, flip tiles, library toolbars, texture tools, music controls, dialogs, pickers, HUDs, and WebGL backgrounds. |
| [`packages/three-primitives`](packages/three-primitives) | Portable React Three Fiber primitives, including torch, brazier, first-person hand, scene controls, dungeon props, environment props, item orbs, traps, and particles. |
| [`packages/notifications`](packages/notifications) | Toast + confirm stack: Zustand store, imperative `notify*` bridge, accessible DOM host, and CSS variables. |
| [`packages/ai-common`](packages/ai-common) | Shared helpers for local AI generation CLIs. |
| [`packages/ai-image`](packages/ai-image) | OpenAI Images and local SDXL image generation helpers. |
| [`packages/ai-music`](packages/ai-music) | Local ACE-Step music/audio generation runners. |
| [`packages/ai-3d`](packages/ai-3d) | SDXL, Hunyuan3D, and procedural asset generation helpers. |
| [`packages/ai-refinement`](packages/ai-refinement) | Strong/local model routing policy for project-refinement agents. |
| [`references/MusicalAppReactConcept`](references/MusicalAppReactConcept) | Optional local reference folder used during extraction work. |

## Scripts

| Command | Description |
|---------|-------------|
| `npm install` | Install all workspace dependencies. |
| `npm test` | Run Vitest across packages and the Storybook shell. |
| `npm run build` | Build every workspace that defines a build script, including the public Storybook app. |
| `npm run example:dev` | Start the Vite Storybook app on port `5179`. |
| `npm run storybook:dev` | Alias for the custom component Storybook app. |
| `npm run lint` | ESLint on this monorepo. |

## Storybook Run

```bash
npm install
npm run build
npm run preview --workspace=example-web -- --host 127.0.0.1 --port 4105
```

Open `http://127.0.0.1:4105/`.

For live development:

```bash
npm run storybook:dev
```

The catalog supports direct story links such as:

- `/#button/disabled`
- `/#library-card/selected`
- `/#library-toolbar/default`
- `/#texture-kit/default`
- `/#music-workspace/playing`
- `/#aero-liquid-background/default`
- `/#modal-dialog/default`
- `/#instrument-picker/layers`
- `/#game-hud/default`
- `/#preview-card/default`
- `/#flip-tile/mixed`
- `/#display-title/hero`
- `/#torch/cool`
- `/#brazier/warm`
- `/#first-person-hand/held-item`
- `/#scene-controls/active`
- `/#dungeon-props/default`
- `/#trap-and-effects/default`
- `/#environment-props/default`
- `/#item-orb/default`
- `/#notifications/confirm`

## Adding Components

1. Create or update a package under `packages/<name>/` with a scoped name like `@cross-repo-libs/<name>`.
2. Export the component from the package entrypoint and add focused package tests.
3. Add a public story in `apps/example-web/src/storybook/storyRegistry.tsx`.
4. Re-run `npm install` if workspace dependencies changed.

## Consuming Packages

Local file link example:

```json
{
  "dependencies": {
    "@cross-repo-libs/react-ui": "file:../cross-repo-libs/packages/react-ui",
    "@cross-repo-libs/notifications": "file:../cross-repo-libs/packages/notifications"
  }
}
```

Import optional styles where a package exposes them:

```ts
import '@cross-repo-libs/react-ui/styles.css';
import '@cross-repo-libs/notifications/styles.css';
```

## Maintenance

`component-inventory.json` and `npm run components:scan` are internal maintenance aids for tracking local source references. They are not part of the public Storybook UI.

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

Do not enable Cloudflare Access for the demo deployment. Leave frame-blocking headers unset so the portfolio can iframe the public build.
