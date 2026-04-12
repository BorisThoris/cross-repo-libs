import React, { act } from 'react';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { createRoot } from 'react-dom/client';
import { useNotificationStore } from './notificationStore.js';
import { NotificationHost } from './NotificationHost.js';

let container: HTMLDivElement;
let root: ReturnType<typeof createRoot> | null = null;

const renderWithProviders = async () => {
  await act(async () => {
    root = createRoot(container);
    root.render(
      <NotificationHost>
        <div data-testid="child-content">content</div>
      </NotificationHost>
    );
  });
};

const flush = async () => {
  await act(async () => {
    await Promise.resolve();
  });
};

const findCloseButton = () =>
  container.querySelector('button[aria-label="Close notification"]') as HTMLButtonElement | null;

describe('NotificationHost', () => {
  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    useNotificationStore.setState({
      notifications: [],
      maxNotifications: 5,
      notificationSequence: 0
    });
  });

  afterEach(async () => {
    if (root) {
      await act(async () => {
        root!.unmount();
      });
      root = null;
    }
    if (container) {
      container.remove();
    }
  });

  test('uses semantic roles for info, error, and confirmation notifications', async () => {
    await renderWithProviders();

    await act(async () => {
      useNotificationStore.getState().showInfo('info-message', 0);
      useNotificationStore.getState().showError('error-message', 0);
    });
    const confirmPromise = useNotificationStore.getState().confirm('confirm-message');
    await flush();

    const statusNotification = container.querySelector('[role="status"]');
    const errorNotification = container.querySelector('[role="alert"]');
    const confirmNotification = container.querySelector('[role="alertdialog"]');

    expect(statusNotification?.textContent).toContain('info-message');
    expect(errorNotification?.textContent).toContain('error-message');
    expect(confirmNotification?.textContent).toContain('confirm-message');

    const confirmItem = useNotificationStore
      .getState()
      .notifications.find((notification) => notification.message === 'confirm-message');
    expect(confirmItem).toBeTruthy();
    useNotificationStore.getState().resolveNotification(confirmItem!.id, true);
    await expect(confirmPromise).resolves.toBe(true);
  });

  test('dismiss button resolves confirmation as false', async () => {
    await renderWithProviders();

    const confirmPromise = useNotificationStore.getState().confirm('dismiss-confirm');
    await flush();
    const closeButton = findCloseButton();
    expect(closeButton).toBeTruthy();
    closeButton!.click();

    await expect(confirmPromise).resolves.toBe(false);
    await flush();
    expect(container.textContent).not.toContain('dismiss-confirm');
  });

  test('escape key cancels confirmation notifications', async () => {
    await renderWithProviders();

    const confirmPromise = useNotificationStore.getState().confirm('escape-confirm');
    await flush();
    window.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Escape' }));

    await expect(confirmPromise).resolves.toBe(false);
  });
});
