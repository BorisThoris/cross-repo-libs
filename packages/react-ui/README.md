# @cross-repo-libs/react-ui

Reusable React UI primitives for the cross-repo-libs workspace.

## Usage

Import components from the package root and import the stylesheet explicitly once in the browser application entrypoint:

```tsx
import { ReadingProgress } from '@cross-repo-libs/react-ui';
import '@cross-repo-libs/react-ui/styles.css';
```

The JavaScript root deliberately has no CSS side-effect import so Node-based SSR and test environments can load it. The `./styles.css` export provides the package's structural styles and theme variables.
