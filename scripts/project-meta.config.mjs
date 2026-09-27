// Metadata inputs for this repository - unique to cross-repo-libs.
//
// Everything here is curated by hand: identity, commands, the screenshot recipe
// (capture), the recorded trailer (trailers.items, kind: capture) and where the
// card, icons and trailers are published. scripts/generate-project-meta.mjs
// derives the rest into project.meta.json; scripts/project-media.test.mjs
// checks that everything here was actually produced.
//   npm run meta:refresh   trailers -> shots -> social -> icons -> meta
//   npm run test:media     the media contract

import path from 'node:path';

const portfolioRoot = process.env.PORTFOLIO_ROOT ?? String.raw`C:\Users\Gaming PC\Desktop\Repos\portfolio`;

export default {
  "slug": "cross-repo-libs",
  "classification": "web-library",
  "appDir": "apps/example-web",
  "curated": {
    "title": "Cross Repo Libs",
    "subtitle": "Component showcase for the shared packages",
    "description": "A Storybook-style showcase of the packages shared across these projects: React UI pieces (buttons, cards, HUDs, dialogs, a pixel texture drawer), React Three Fiber props such as torches and braziers, a toast and confirm stack, and the local AI image, music and 3D generation helpers behind them.",
    "tags": [
      "Monorepo",
      "Component Library",
      "React",
      "React Three Fiber",
      "Storybook"
    ],
    "accent": "#a78bfa",
    "deploymentUrl": "https://cross-repo-libs-git.pages.dev/",
    "localUrl": "http://127.0.0.1:4105/",
    "buildCommand": "npm run build --workspace=example-web",
    "buildOutput": "apps/example-web/dist",
    "runCommand": "npm run dev --workspace=example-web -- --host 127.0.0.1 --port 4105",
    "devPort": 4105,
    "showcaseTier": "showcase",
    "showcaseOrder": 5
  },
  "capture": {
    "route": "/",
    "actions": [
      {
        "type": "click",
        "target": {
          "role": "button",
          "name": "Torch"
        },
        "label": "open the torch story",
        "optional": true
      },
      {
        "type": "wait",
        "ms": 2500,
        "label": "let the 3D story render"
      }
    ],
    "waitAfterReadyMs": 800
  },
  "scores": {
    "priorityScore": 89,
    "demoabilityScore": 82,
    "depthScore": 80,
    "polishScore": 72,
    "uniquenessScore": 84,
    "maintenanceScore": 80
  },
  "analysisNotes": "Reusable package workspace with an example app; less visual than games but valuable as architecture and shared-library evidence.",
  "social": {
    "htmlFile": "apps/example-web/index.html",
    "pageTitle": "Cross Repo Libs · component showcase",
    "staticDir": "apps/example-web/public",
    "imageName": "og-image.jpg",
    "imageUrlPath": "/og-image.jpg"
  },
  "icons": {
    "background": "#1b3f8f",
    "themeColor": "#2457c5",
    "shortName": "Cross Repo Libs"
  },
  "media": {
    "sourceDir": path.join(portfolioRoot, "public", "project-shots", "cross-repo-libs", "latest"),
    "publicPathPrefix": "/project-shots/cross-repo-libs/latest",
    "primaryProfile": "card"
  },
  "trailers": {
    "items": [
      {
        "id": "tour",
        "title": "Cross Repo Libs: the component storybook",
        "kind": "capture",
        "inputs": [
          "apps/example-web/src",
          "packages",
          "apps/example-web/index.html"
        ],
        "source": "deployment",
        "music": "project-media/music/tour.m4a",
        "posterAt": 0.5,
        "recipe": {
          "route": "/",
          "viewport": {
            "width": 1280,
            "height": 720
          },
          "durationMs": 24000,
          "setup": {
            "actions": [
              {
                "type": "waitFor",
                "target": {
                  "role": "button",
                  "name": "Torch"
                },
                "state": "visible",
                "label": "wait for the story list"
              }
            ],
            "waitAfterReadyMs": 1500
          },
          "timeline": [
            {
              "type": "click",
              "target": {
                "role": "button",
                "name": "Torch"
              },
              "label": "torch",
              "optional": true
            },
            {
              "type": "wait",
              "ms": 3500
            },
            {
              "type": "click",
              "target": {
                "role": "button",
                "name": "Brazier"
              },
              "label": "brazier",
              "optional": true
            },
            {
              "type": "wait",
              "ms": 3000
            },
            {
              "type": "click",
              "target": {
                "role": "button",
                "name": "GameHud"
              },
              "label": "game hud",
              "optional": true
            },
            {
              "type": "wait",
              "ms": 3000
            },
            {
              "type": "click",
              "target": {
                "role": "button",
                "name": "MemoryDungeonKit"
              },
              "label": "memory dungeon kit",
              "optional": true
            },
            {
              "type": "wait",
              "ms": 3000
            },
            {
              "type": "click",
              "target": {
                "role": "button",
                "name": "TextureKit"
              },
              "label": "texture kit",
              "optional": true
            },
            {
              "type": "wait",
              "ms": 3000
            },
            {
              "type": "click",
              "target": {
                "role": "button",
                "name": "FlipTile"
              },
              "label": "flip tile",
              "optional": true
            },
            {
              "type": "wait",
              "ms": 2500
            },
            {
              "type": "click",
              "target": {
                "role": "button",
                "name": "AeroLiquidBackground"
              },
              "label": "aero background",
              "optional": true
            }
          ]
        }
      }
    ]
  }
};
