import { useCallback } from 'react';
import {
  NotificationHost,
  notifyError,
  notifyInfo,
  notifySuccess,
  notifyWarning,
  useNotificationActions
} from '@cross-repo-libs/notifications';

function DemoPanel() {
  const { showInfo, confirm } = useNotificationActions();

  const runConfirm = useCallback(async () => {
    const ok = await confirm('Delete the fake asset?');
    if (ok) {
      showInfo('Confirmed.');
    } else {
      showInfo('Cancelled.');
    }
  }, [confirm, showInfo]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        maxWidth: 420,
        fontFamily: 'system-ui, sans-serif',
        padding: 24
      }}
    >
      <h1 style={{ margin: 0 }}>Notifications demo</h1>
      <p style={{ margin: 0, lineHeight: 1.5, color: '#444' }}>
        Toasts use the shared store. The button below calls imperative <code>notify*</code> helpers (same bridge the
        Musical app uses for non-React code).
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        <button type="button" onClick={() => showInfo('Saved (hook).')}>
          Hook info
        </button>
        <button type="button" onClick={() => notifySuccess('Exported (imperative).')}>
          Imperative success
        </button>
        <button type="button" onClick={() => notifyWarning('Headroom low (imperative).')}>
          Imperative warning
        </button>
        <button type="button" onClick={() => notifyError('Render failed (imperative).')}>
          Imperative error
        </button>
        <button type="button" onClick={() => notifyInfo('Tip: theme with CSS variables on .crn-host.')}>
          Imperative info
        </button>
        <button type="button" onClick={() => void runConfirm()}>
          Confirm dialog
        </button>
      </div>
    </div>
  );
}

export function App() {
  return (
    <NotificationHost>
      <DemoPanel />
    </NotificationHost>
  );
}
