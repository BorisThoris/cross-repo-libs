import { describe, expect, it } from 'vitest';
import { buildModelRoutes, routeLabel, selectModelRoute } from './modelRouting.js';

describe('modelRouting', () => {
  it('falls cheap routes back to OpenAI when local routing is disabled', () => {
    const routes = buildModelRoutes({
      OPENAI_MODEL: 'gpt-coding-model',
      LOCAL_LLM_ENABLED: 'false',
      LOCAL_LLM_MODEL: 'qwen2.5-coder:7b'
    });

    expect(routes.cheap.provider).toBe('openai-responses');
    expect(routes.cheap.model).toBe('gpt-coding-model');
    expect(selectModelRoute(routes, 'analysis')).toBe(routes.cheap);
    expect(selectModelRoute(routes, 'synthesis')).toBe(routes.strong);
  });

  it('uses a local OpenAI-compatible route when enabled', () => {
    const routes = buildModelRoutes({
      OPENAI_MODEL: 'gpt-coding-model',
      LOCAL_LLM_ENABLED: 'true',
      LOCAL_LLM_BASE_URL: 'http://127.0.0.1:11434/v1',
      LOCAL_LLM_MODEL: 'qwen2.5-coder:7b'
    });

    expect(routes.cheap.provider).toBe('openai-compatible-chat');
    expect(routes.cheap.baseUrl).toBe('http://127.0.0.1:11434/v1');
    expect(routeLabel(routes.cheap)).toBe('cheap:openai-compatible-chat:qwen2.5-coder:7b');
  });

  it('requires a strong model', () => {
    expect(() => buildModelRoutes({})).toThrow('OPENAI_MODEL is required');
  });
});
