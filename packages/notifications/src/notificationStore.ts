import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { rafDelay } from './rafDelay.js';

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export type ConfirmHandlerBundle = {
  isSettled: () => boolean;
  onConfirm: (result: boolean) => void;
  onCancel: (result: boolean) => void;
};

export type NotificationRecord = {
  duration: number;
  id: string;
  message: string;
  onConfirm: ConfirmHandlerBundle | null;
  type: NotificationType;
};

const DEFAULT_NOTIFICATION_LIMIT = 5;

type ConfirmInput =
  | ((result: boolean) => void)
  | {
      onConfirm?: (result: boolean) => void;
      onCancel?: (result: boolean) => void;
    };

const resolveConfirmHandlers = (onConfirm: ConfirmInput | null): ConfirmHandlerBundle | null => {
  if (!onConfirm) {
    return null;
  }

  const confirmHandler =
    typeof onConfirm === 'function'
      ? onConfirm
      : typeof onConfirm.onConfirm === 'function'
        ? onConfirm.onConfirm
        : null;
  const cancelHandler =
    typeof onConfirm === 'object' && typeof onConfirm.onCancel === 'function' ? onConfirm.onCancel : null;

  if (!confirmHandler && !cancelHandler) {
    return null;
  }

  let settled = false;
  const wrapSettlement =
    (handler: ((result: boolean) => void) | null | undefined) => (result: boolean) => {
      if (settled) {
        return;
      }
      settled = true;
      if (typeof handler === 'function') {
        handler(result);
      }
    };

  return {
    isSettled: () => settled,
    onConfirm: wrapSettlement(confirmHandler ?? null),
    onCancel: wrapSettlement(cancelHandler ?? null)
  };
};

const settleConfirmation = (notification: NotificationRecord | null | undefined, result = false) => {
  const confirmHandlers = notification?.onConfirm;
  if (!confirmHandlers || confirmHandlers.isSettled()) {
    return;
  }

  if (result) {
    confirmHandlers.onConfirm(true);
    return;
  }

  confirmHandlers.onCancel(false);
};

const enforceNotificationLimit = (
  notifications: NotificationRecord[],
  limit: number
): { notifications: NotificationRecord[]; removed: NotificationRecord[] } => {
  if (!Array.isArray(notifications)) {
    return {
      notifications: [],
      removed: []
    };
  }
  if (notifications.length <= limit) {
    return {
      notifications,
      removed: []
    };
  }

  const next = [...notifications];
  const removed: NotificationRecord[] = [];
  while (next.length > limit) {
    const firstNonConfirmIndex = next.findIndex((notification) => !notification?.onConfirm);
    const removalIndex = firstNonConfirmIndex === -1 ? 0 : firstNonConfirmIndex;
    const removedNotification = next.splice(removalIndex, 1)[0];
    if (removedNotification) {
      removed.push(removedNotification);
    }
  }

  return {
    notifications: next,
    removed
  };
};

export type NotificationStoreState = {
  notifications: NotificationRecord[];
  maxNotifications: number;
  notificationSequence: number;
  getNextNotificationId: () => string;
  addNotification: (
    message: string,
    type?: NotificationType,
    duration?: number,
    onConfirm?: ConfirmInput | null
  ) => string;
  resolveNotification: (id: string, result?: boolean) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  setMaxNotifications: (value: number) => void;
  showSuccess: (message: string, duration?: number) => string;
  showError: (message: string, duration?: number) => string;
  showWarning: (message: string, duration?: number) => string;
  showInfo: (message: string, duration?: number) => string;
  confirm: (message: string) => Promise<boolean>;
};

export const createNotificationStore = () =>
  create<NotificationStoreState>()(
    subscribeWithSelector((set, get) => ({
      notifications: [],
      maxNotifications: DEFAULT_NOTIFICATION_LIMIT,
      notificationSequence: 0,

      getNextNotificationId: () => {
        const nextValue = get().notificationSequence + 1;
        set({ notificationSequence: nextValue });
        return `notification_${nextValue}`;
      },

      addNotification: (message, type = 'info', duration = 3000, onConfirm = null) => {
        const id = get().getNextNotificationId();
        const normalizedConfirmHandlers = resolveConfirmHandlers(onConfirm);
        const newNotification: NotificationRecord = {
          duration,
          id,
          message,
          onConfirm: normalizedConfirmHandlers,
          type
        };

        let removedByLimit: NotificationRecord[] = [];
        set((state) => ({
          notifications: (() => {
            const { notifications: limitedNotifications, removed } = enforceNotificationLimit(
              [...state.notifications, newNotification],
              state.maxNotifications
            );
            removedByLimit = removed;
            return limitedNotifications;
          })()
        }));
        removedByLimit.forEach((notification) => settleConfirmation(notification, false));

        if (duration > 0 && !normalizedConfirmHandlers) {
          rafDelay(() => {
            get().removeNotification(id);
          }, duration);
        }

        return id;
      },

      resolveNotification: (id, result = false) => {
        let removedNotification: NotificationRecord | null = null;
        set((state) => {
          removedNotification = state.notifications.find((notification) => notification.id === id) ?? null;
          return {
            notifications: state.notifications.filter((notification) => notification.id !== id)
          };
        });
        settleConfirmation(removedNotification, result);
      },

      removeNotification: (id) => {
        get().resolveNotification(id, false);
      },

      clearNotifications: () => {
        const notifications = get().notifications;
        notifications.forEach((notification) => settleConfirmation(notification, false));
        set({ notifications: [] });
      },

      setMaxNotifications: (value) => {
        const nextLimit = Number.isFinite(value) ? Math.max(1, Math.floor(value)) : DEFAULT_NOTIFICATION_LIMIT;
        let removedByLimit: NotificationRecord[] = [];
        set((state) => ({
          maxNotifications: nextLimit,
          notifications: (() => {
            const { notifications: limitedNotifications, removed } = enforceNotificationLimit(
              state.notifications,
              nextLimit
            );
            removedByLimit = removed;
            return limitedNotifications;
          })()
        }));
        removedByLimit.forEach((notification) => settleConfirmation(notification, false));
      },

      showSuccess: (message, duration = 3000) => {
        return get().addNotification(message, 'success', duration);
      },

      showError: (message, duration = 5000) => {
        return get().addNotification(message, 'error', duration);
      },

      showWarning: (message, duration = 4000) => {
        return get().addNotification(message, 'warning', duration);
      },

      showInfo: (message, duration = 3000) => {
        return get().addNotification(message, 'info', duration);
      },

      confirm: (message) => {
        return new Promise<boolean>((resolve) => {
          const onConfirm = (result: boolean) => {
            resolve(result);
          };
          const onCancel = (result: boolean) => {
            resolve(result);
          };
          get().addNotification(message, 'info', 0, { onCancel, onConfirm });
        });
      }
    }))
  );

/** Default app-wide store (matches MusicalAppReactConcept singleton pattern). */
export const useNotificationStore = createNotificationStore();

export type NotificationStore = ReturnType<typeof createNotificationStore>;
