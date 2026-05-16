# @cross-repo-libs/ai-music

Reusable local music generation tooling centered on ACE-Step 1.5.

## CLI

```bash
node packages/ai-music/scripts/run-ace-batch.mjs --dry-run --jobs path/to/jobs.json
node packages/ai-music/scripts/run-ace-batch.mjs ace-step --jobs path/to/jobs.json
```

From a consuming repo, run with that repo as `cwd`, or set `CROSS_AI_REPO_ROOT`.

## Local Model Store

The local ACE-Step checkout lives at:

```text
local-models/ace-step-1.5/
```

That directory is gitignored because it contains large model/checkpoint files. The runner uses it as `ACESTEP_PROJECT_ROOT` when the env var is not already set.

## Environment

- `ACESTEP_PYTHON`: absolute Python interpreter path.
- `ACESTEP_PROJECT_ROOT`: override model/checkpoint root.
- `ACESTEP_CHECKPOINTS_DIR`: override ACE-Step checkpoints folder.
- `ACESTEP_DEVICE`: `cuda`, `cpu`, or `auto`.

The job JSON shape is the ACE-Step batch shape: either a top-level array or `{ "jobs": [...] }`.
