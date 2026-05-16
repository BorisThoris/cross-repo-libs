# @cross-repo-libs/ai-image

Reusable image generation tooling for OpenAI Images and local SDXL asset batches.

## CLI

```bash
node packages/ai-image/scripts/image_gen.mjs openai --prompt "..." --out out.png
node packages/ai-image/scripts/image_gen.mjs openai --list-resolutions
node packages/ai-image/scripts/image_gen.mjs sdxl-card-backs --dry-run
node packages/ai-image/scripts/image_gen.mjs sdxl-face-panels --dry-run
```

From a consuming repo, run with that repo as `cwd`, or set `CROSS_AI_REPO_ROOT`.

## Environment

- `OPENAI_API_KEY`: required for OpenAI image generation.
- `AI_IMAGE_PYTHON`: optional Python interpreter path for local SDXL scripts.
- `HF_TOKEN`: optional for gated Hugging Face SDXL models.

The local SDXL scripts keep their default prompt grids but accept manifests for reusable batches.
