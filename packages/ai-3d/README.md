# @cross-repo-libs/ai-3d

Reusable game-ready 3D asset generation tooling.

## Commands

```bash
cross-ai-3d verify
cross-ai-3d prop --prompt "red sci-fi button" --out button.glb
cross-ai-3d from-image --image ref.png --out asset.glb
cross-ai-3d room --prompt "small office room" --out office-room.glb
```

All commands support `--dry-run`.

## Backends

- `prop`: text prompt to SDXL reference PNG, then Hunyuan3D image-to-3D GLB.
- `from-image`: Hunyuan3D image-to-3D GLB from an existing reference PNG.
- `room`: procedural Blender scene generation for clean, editable room-scale assets.

Outputs default to `.glb` plus a sidecar `.manifest.json` with prompt, backend, generated files, dimensions, and collider hints.

## Environment

- `AI3D_PYTHON`: Python interpreter for Hunyuan3D wrappers.
- `HUNYUAN3D_ROOT`: local Hunyuan3D checkout.
- `HUNYUAN3D_MODEL`: model id or path, default `tencent/Hunyuan3D-2mini`.
- `HUNYUAN3D_SUBFOLDER`: model subfolder, default `hunyuan3d-dit-v2-mini`.
- `BLENDER`: path to `blender` when it is not on `PATH`.

The local default setup uses:

```text
.venv-ai-3d/
local-models/hunyuan3d-2/
local-output/ai-3d/
```

Those folders are gitignored.
