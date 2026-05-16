# @cross-repo-libs/ai-refinement

Reusable model routing helpers for project refinement agents.

This package mirrors the routing policy used by `portfolio-ai-orchestrator`:

- `strong`: OpenAI Responses API, intended for task synthesis and code patches.
- `cheap`: local OpenAI-compatible chat endpoint, intended for lower-risk analysis and manual cleanup.

## Environment

```text
OPENAI_MODEL=
LOCAL_LLM_ENABLED=false
LOCAL_LLM_BASE_URL=http://127.0.0.1:11434/v1
LOCAL_LLM_MODEL=qwen2.5-coder:7b
LOCAL_LLM_API_KEY=ollama
```

## Usage

```ts
import { buildModelRoutes, selectModelRoute } from '@cross-repo-libs/ai-refinement';

const routes = buildModelRoutes(process.env);
const analysisRoute = selectModelRoute(routes, 'analysis');
```

Default task routing:

- `analysis`: cheap when local LLM routing is enabled, otherwise strong.
- `synthesis`: strong.
- `execution`: strong unless explicitly allowed.

The package does not call model APIs directly. It defines route metadata and request policy so consuming tools can use their own OpenAI, Ollama, or compatible clients.
