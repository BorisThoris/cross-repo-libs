export type ModelTier = 'strong' | 'cheap';
export type ModelProvider = 'openai-responses' | 'openai-compatible-chat';
export type RefinementTaskKind = 'analysis' | 'synthesis' | 'execution' | 'manual';

export interface ModelRoute {
  tier: ModelTier;
  provider: ModelProvider;
  model: string;
  baseUrl?: string;
  apiKeyEnv?: string;
}

export interface ModelRoutes {
  strong: ModelRoute;
  cheap: ModelRoute;
}

export interface RefinementRoutingPolicy {
  analysis: ModelTier;
  synthesis: ModelTier;
  execution: ModelTier;
  manual: ModelTier;
}

export const defaultRefinementPolicy: RefinementRoutingPolicy = {
  analysis: 'cheap',
  synthesis: 'strong',
  execution: 'strong',
  manual: 'cheap'
};

export function cheapRouteEnabled(env: Pick<NodeJS.ProcessEnv, string> = process.env): boolean {
  return ['1', 'true', 'yes', 'on'].includes((env.LOCAL_LLM_ENABLED ?? '').toLowerCase());
}

export function buildModelRoutes(env: Pick<NodeJS.ProcessEnv, string> = process.env): ModelRoutes {
  const strongModel = env.OPENAI_MODEL?.trim();
  if (!strongModel) {
    throw new Error('OPENAI_MODEL is required for strong project-refinement routes.');
  }

  const cheapEnabled = cheapRouteEnabled(env);
  const cheapModel = env.LOCAL_LLM_MODEL?.trim() || strongModel;

  return {
    strong: {
      tier: 'strong',
      provider: 'openai-responses',
      model: strongModel,
      apiKeyEnv: 'OPENAI_API_KEY'
    },
    cheap: cheapEnabled
      ? {
          tier: 'cheap',
          provider: 'openai-compatible-chat',
          model: cheapModel,
          baseUrl: env.LOCAL_LLM_BASE_URL?.trim() || 'http://127.0.0.1:11434/v1',
          apiKeyEnv: 'LOCAL_LLM_API_KEY'
        }
      : {
          tier: 'cheap',
          provider: 'openai-responses',
          model: strongModel,
          apiKeyEnv: 'OPENAI_API_KEY'
        }
  };
}

export function selectModelRoute(
  routes: ModelRoutes,
  taskKind: RefinementTaskKind,
  policy: RefinementRoutingPolicy = defaultRefinementPolicy
): ModelRoute {
  return routes[policy[taskKind]];
}

export function routeLabel(route: ModelRoute): string {
  return `${route.tier}:${route.provider}:${route.model}`;
}
