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
    "subtitle": "Reusable workspace packages",
    "description": "A monorepo of shared packages and an example web app that demonstrates local notifications and reusable runtime utilities.",
    "tags": [
      "Workspaces",
      "TypeScript",
      "React",
      "Vite"
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
    "staticDir": "apps/example-web/public",
    "imageName": "og-image.jpg",
    "imageUrlPath": "/og-image.jpg"
  },

  media: {
    sourceDir: path.join(portfolioRoot, "public", "project-shots", "cross-repo-libs", "latest"),
    publicPathPrefix: "/project-shots/cross-repo-libs/latest",
    primaryProfile: "card"
  }
};
