import { afterEach, describe, expect, test, vi } from 'vitest';
import { configureNotificationFallbackLog, notifyError, setGlobalNotificationHandler } from './notificationBridge.js';

describe('notificationBridge', () => {
  afterEach(() => {
    setGlobalNotificationHandler(null);
    configureNotificationFallbackLog(null);
    vi.restoreAllMocks();
  });

  test('falls back to console when no handler is registered', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    notifyError('hello');
    expect(spy).toHaveBeenCalledWith('[Notification]', 'hello');
  });

  test('uses configureNotificationFallbackLog when set', () => {
    const sink = vi.fn();
    configureNotificationFallbackLog(sink);
    notifyError('x');
    expect(sink).toHaveBeenCalledWith('error', 'x');
  });
});
