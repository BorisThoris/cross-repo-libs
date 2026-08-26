# cross-repo-libs

Public custom component Storybook and npm workspaces monorepo for reusable React UI, React Three Fiber primitives, notifications, and local AI helper packages shared across desktop apps.

## Contents

| Path | Purpose |
|------|---------|
| [`apps/example-web`](apps/example-web) | Public custom Storybook-style Vite app for browsing component stories, variants, docs, and live previews. |
| [`packages/react-ui`](packages/react-ui) | Reusable React UI components: buttons, display titles, callouts, panels, cards, preview cards, flip tiles, library toolbars, compact reading chrome, reading progress, bookmark actions, texture tools, music controls, dialogs, pickers, HUDs, and WebGL backgrounds. |
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

The React UI JavaScript entrypoint does not load CSS automatically. Import package styles explicitly once in the browser application entrypoint:

```ts
import '@cross-repo-libs/react-ui/styles.css';
import '@cross-repo-libs/notifications/styles.css';
```

### Reading Chrome Primitives

`CompactToolbar`, `ReadingProgress`, and `BookmarkButton` are app-neutral building blocks. Consumers own scroll detection, persistence, focus management, and navigation behavior.

```tsx
import {
  BookmarkButton,
  CompactToolbar,
  ReadingProgress
} from '@cross-repo-libs/react-ui';

<CompactToolbar
  aria-label={labels.readingControls}
  center={<ReadingProgress label={labels.readingProgress} value={progressPercent} />}
  leading={backAction}
  position="fixed"
  trailing={
    <BookmarkButton
      active={isBookmarked}
      activeLabel={labels.removeBookmark}
      inactiveLabel={labels.addBookmark}
      onClick={toggleBookmark}
    />
  }
  translateY={chromeVisible ? '0%' : '-100%'}
/>;
```

The primitives do not contain user-facing locale defaults. Supply the toolbar accessible name, reading-progress label, and both bookmark-state labels from the consuming application's localization layer. `ReadingProgress` uses a native determinate `progress` element and clamps its value to the configured range. `BookmarkButton` provides a 44px minimum touch target.

Theme the primitives without replacing their structural classes:

```css
.reader-chrome {
  --crui-compact-toolbar-z-index: 40;
  --crui-compact-toolbar-transition: 180ms ease;
  --crui-reading-progress-track: rgb(255 255 255 / 16%);
  --crui-reading-progress-fill: #d5a84b;
  --crui-bookmark-button-background: transparent;
  --crui-bookmark-button-color: #f6f0df;
  --crui-bookmark-button-active-background: #23604f;
  --crui-bookmark-button-active-color: #ffffff;
  --crui-bookmark-button-radius: 999px;
}
```

The local `file:` dependency above is for development on a machine containing both repositories. CI and deployment consumers must use a published, pinned package version so clean checkouts are reproducible:

```json
{
  "dependencies": {
    "@cross-repo-libs/react-ui": "0.1.1"
  }
}
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

## Shared packages

- `@cross-repo-libs/react-ui`: reusable React UI primitives.
- `@cross-repo-libs/book-engine-core`: dependency-free book package contracts, validation, and repository assembly.
- `@cross-repo-libs/book-engine-react`: React provider and hooks for a core book package.

## Release artifacts

Packages release independently with package-specific Git tags: `react-ui-vX.Y.Z`, `book-engine-core-vX.Y.Z`, and `book-engine-react-vX.Y.Z`. Attach the package tarball produced by `npm pack` to its matching GitHub Release and pin consumers to that exact asset URL.

Release tags and tarball assets are immutable. Never replace or rebuild an existing release asset; publish fixes under a new package version and tag.

## Book engine boundary

Consumers assemble the book package and inject repository, storage, theme, and route implementations. Shared engine packages must not import consumer content modules, application singletons, routers, or persistence implementations.
