#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Hunyuan3D image-to-3D wrapper for cross-ai-3d.")
    parser.add_argument("command", choices=("prop", "from-image"))
    parser.add_argument("--prompt", default="")
    parser.add_argument("--image", type=Path)
    parser.add_argument("--out", type=Path, required=True)
    parser.add_argument("--manifest", type=Path, required=True)
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    model = os.environ.get("HUNYUAN3D_MODEL", "tencent/Hunyuan3D-2mini")
    subfolder = os.environ.get("HUNYUAN3D_SUBFOLDER", "hunyuan3d-dit-v2-mini")
    hunyuan_root = os.environ.get("HUNYUAN3D_ROOT", "").strip()
    if hunyuan_root and hunyuan_root not in sys.path:
        sys.path.insert(0, hunyuan_root)

    try:
        from hy3dgen.shapegen import Hunyuan3DDiTFlowMatchingPipeline  # type: ignore
    except ImportError:
        print(
            "Hunyuan3D is not installed in this Python environment.\n"
            "Install Tencent-Hunyuan/Hunyuan3D-2, then set AI3D_PYTHON and optionally HUNYUAN3D_MODEL.\n"
            "For text prompts, generate or provide a reference image first, then run from-image.",
            flush=True,
        )
        return 2

    if not args.image:
        print("--image is required for Hunyuan3D generation.", flush=True)
        return 2

    pipeline = Hunyuan3DDiTFlowMatchingPipeline.from_pretrained(model, subfolder=subfolder)
    mesh = pipeline(image=str(args.image))[0]
    args.out.parent.mkdir(parents=True, exist_ok=True)
    mesh.export(str(args.out))

    manifest = json.loads(args.manifest.read_text(encoding="utf-8")) if args.manifest.is_file() else {}
    manifest["generated"] = True
    manifest["model"] = model
    manifest["subfolder"] = subfolder
    manifest["sourceImage"] = str(args.image)
    args.manifest.write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    print(f"Wrote {args.out}", flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
