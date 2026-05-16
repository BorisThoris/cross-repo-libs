#!/usr/bin/env python3
from __future__ import annotations

import argparse
from pathlib import Path


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Generate an isolated 2D reference image for image-to-3D.")
    parser.add_argument("--prompt", required=True)
    parser.add_argument("--out", type=Path, required=True)
    parser.add_argument("--model", default="stabilityai/stable-diffusion-xl-base-1.0")
    parser.add_argument("--steps", type=int, default=24)
    parser.add_argument("--guidance", type=float, default=6.5)
    parser.add_argument("--seed", type=int, default=424242)
    return parser.parse_args()


def main() -> int:
    args = parse_args()

    import torch
    from diffusers import StableDiffusionXLPipeline

    prompt = (
        f"{args.prompt}, single centered object, game asset reference, orthographic front three-quarter view, "
        "plain neutral background, clean silhouette, physically plausible shape, no text, no watermark"
    )
    negative = (
        "text, watermark, logo, signature, cropped, blurry, duplicate object, busy background, "
        "multiple views, product photo label, hands, person"
    )

    device = "cuda" if torch.cuda.is_available() else "cpu"
    dtype = torch.float16 if device == "cuda" else torch.float32
    pipe = StableDiffusionXLPipeline.from_pretrained(args.model, torch_dtype=dtype, variant="fp16" if device == "cuda" else None)
    pipe = pipe.to(device)
    if hasattr(pipe, "enable_attention_slicing"):
        pipe.enable_attention_slicing()

    generator = torch.Generator(device=device).manual_seed(args.seed)
    image = pipe(
        prompt=prompt,
        negative_prompt=negative,
        num_inference_steps=args.steps,
        guidance_scale=args.guidance,
        width=1024,
        height=1024,
        generator=generator,
    ).images[0]

    args.out.parent.mkdir(parents=True, exist_ok=True)
    image.save(args.out)
    print(f"Wrote reference image: {args.out}", flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
