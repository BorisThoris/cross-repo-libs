// Metadata inputs for this repository - unique to cross-repo-libs.
//
// Everything here is curated by hand. Derived facts (stack, metrics, git,
// screenshots) are computed by scripts/generate-project-meta.mjs, which writes
// project.meta.json. Run it with:
//   npm run meta          regenerate project.meta.json
//   npm run meta:check    fail if project.meta.json is stale

import path from 'node:path';

// Screenshots are captured by the portfolio (npm run capture there). Point
// PORTFOLIO_ROOT elsewhere, or drop images in ./project-media, to override.
const portfolioRoot = process.env.PORTFOLIO_ROOT ?? String.raw`C:\Users\Gaming PC\Desktop\Repos\portfolio`;

export default {
  slug: "cross-repo-libs",
  classification: "web-library",
  // The runnable web app lives in this subdirectory.
  appDir: "apps/example-web",

  curated: {
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

  // How the portfolio screenshot pipeline photographs this project.
  capture: {
    "route": "/"
  },

  scores: {
    "priorityScore": 89,
    "demoabilityScore": 82,
    "depthScore": 80,
    "polishScore": 72,
    "uniquenessScore": 84,
    "maintenanceScore": 80
  },

  analysisNotes:
    "Reusable package workspace with an example app; less visual than games but valuable as architecture and shared-library evidence.",

  // Where the link-preview card lives: the page head that carries the Open
  // Graph tags, and the static directory the image is published from.
  social: {
    "htmlFile": "apps/example-web/index.html",
    "pageTitle": "Cross Repo Libs · component showcase",
    "staticDir": "apps/example-web/public",
    "imageName": "og-image.jpg",
    "imageUrlPath": "/og-image.jpg"
  },

  // The icon set is rendered from favicon.svg by scripts/generate-app-icons.mjs.
  icons: {
    "background": "#1b3f8f",
    "themeColor": "#2457c5",
    "shortName": "Cross Repo Libs"
  },

  media: {
    sourceDir: path.join(portfolioRoot, "public", "project-shots", "cross-repo-libs", "latest"),
    publicPathPrefix: "/project-shots/cross-repo-libs/latest",
    primaryProfile: "card"
  }
};
