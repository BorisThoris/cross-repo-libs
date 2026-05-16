#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Generate a simple game-ready procedural room GLB in Blender.")
    parser.add_argument("--prompt", required=True)
    parser.add_argument("--out", type=Path, required=True)
    parser.add_argument("--manifest", type=Path, required=True)
    argv = sys.argv
    if "--" in argv:
        argv = argv[argv.index("--") + 1 :]
    else:
        argv = []
    return parser.parse_args(argv)


def dimensions(prompt: str) -> tuple[float, float, float]:
    lower = prompt.lower()
    if "large" in lower:
        return 10.0, 8.0, 3.2
    if "small" in lower:
        return 5.0, 4.0, 2.8
    return 7.0, 5.0, 3.0


def main() -> int:
    args = parse_args()

    import bpy  # type: ignore

    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete()

    width, depth, height = dimensions(args.prompt)

    def cube(name: str, loc: tuple[float, float, float], scale: tuple[float, float, float], material: str) -> None:
        bpy.ops.mesh.primitive_cube_add(size=1, location=loc)
        obj = bpy.context.object
        obj.name = name
        obj.dimensions = scale
        bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
        mat = bpy.data.materials.get(material) or bpy.data.materials.new(material)
        if material == "wall":
            mat.diffuse_color = (0.75, 0.78, 0.8, 1)
        elif material == "floor":
            mat.diffuse_color = (0.25, 0.25, 0.23, 1)
        elif material == "furniture":
            mat.diffuse_color = (0.42, 0.28, 0.16, 1)
        else:
            mat.diffuse_color = (0.1, 0.12, 0.14, 1)
        obj.data.materials.append(mat)

    cube("floor_collider", (0, 0, -0.05), (width, depth, 0.1), "floor")
    cube("back_wall_collider", (0, depth / 2, height / 2), (width, 0.12, height), "wall")
    cube("left_wall_collider", (-width / 2, 0, height / 2), (0.12, depth, height), "wall")
    cube("right_wall_collider", (width / 2, 0, height / 2), (0.12, depth, height), "wall")

    if "office" in args.prompt.lower():
        cube("desk", (0, depth * 0.15, 0.45), (2.2, 0.8, 0.9), "furniture")
        cube("chair", (0, depth * -0.12, 0.45), (0.7, 0.7, 0.9), "furniture")
        cube("monitor", (0, depth * 0.28, 1.1), (0.9, 0.08, 0.55), "dark")
        cube("button", (width * 0.3, depth * 0.15, 1.0), (0.25, 0.25, 0.12), "dark")

    bpy.ops.object.light_add(type="AREA", location=(0, 0, height - 0.2))
    bpy.context.object.name = "ceiling_area_light"
    bpy.context.object.data.energy = 350
    bpy.context.object.data.size = min(width, depth) * 0.5

    args.out.parent.mkdir(parents=True, exist_ok=True)
    bpy.ops.export_scene.gltf(filepath=str(args.out), export_format="GLB")

    manifest = json.loads(args.manifest.read_text(encoding="utf-8")) if args.manifest.is_file() else {}
    manifest["generated"] = True
    manifest["objects"] = [obj.name for obj in bpy.context.scene.objects]
    manifest["dimensionsMeters"] = {"width": width, "depth": depth, "height": height}
    args.manifest.write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
