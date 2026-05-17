// Suppress React 19 "not configured to support act" in Vitest + jsdom
(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

class ResizeObserverStub {
  observe() {
    // jsdom layout is synthetic; tests only need Canvas dependencies to mount.
  }

  unobserve() {
    // jsdom layout is synthetic; tests only need Canvas dependencies to mount.
  }

  disconnect() {
    // jsdom layout is synthetic; tests only need Canvas dependencies to mount.
  }
}

(globalThis as unknown as { ResizeObserver?: typeof ResizeObserver }).ResizeObserver ??= ResizeObserverStub;
