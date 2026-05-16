import { useCallback, type CSSProperties } from 'react';
import {
  NotificationHost,
  notifyError,
  notifyInfo,
  notifySuccess,
  notifyWarning,
  useNotificationActions
} from '@cross-repo-libs/notifications';

const packages = [
  {
    name: 'notifications',
    label: 'Toast + confirm stack',
    detail: 'Zustand-backed notification host with imperative helpers for React and non-React callers.',
    status: 'Used live on this page'
  },
  {
    name: 'ai-image',
    label: 'Image generation CLI',
    detail: 'OpenAI Images and local SDXL wrappers with dry-run friendly command planning.',
    status: 'Static sample command'
  },
  {
    name: 'ai-music',
    label: 'ACE-Step batch runner',
    detail: 'Local music job queue helpers for repeatable prompt, seed, and output manifests.',
    status: 'Queued sample jobs'
  },
  {
    name: 'ai-3d',
    label: '3D asset pipeline',
    detail: 'SDXL reference image, Hunyuan3D, and procedural room generation utilities.',
    status: 'GLB export preview'
  },
  {
    name: 'ai-refinement',
    label: 'Model routing policy',
    detail: 'Rules for assigning strong or local models to portfolio refinement agents.',
    status: 'Routing surfaced'
  },
  {
    name: 'ai-common',
    label: 'Shared runtime helpers',
    detail: 'Reusable parsing, filesystem, and process utilities for AI helper packages.',
    status: 'Foundation package'
  }
];

const sampleLog = [
  '$ node packages/ai-image/scripts/image_gen.mjs --prompt "portfolio asset" --dry-run',
  'DRY RUN image: would write apps/example-web/public/workbench-card.png',
  '$ node packages/ai-music/scripts/run-ace-batch.mjs --jobs scripts/jobs.example.json --dry-run',
  'QUEUED music: 3 ACE-Step jobs, local model required only outside dry-run',
  '$ node packages/ai-3d/scripts/cross-ai-3d.mjs --mode procedural-room --format glb --dry-run',
  'EXPORT 3d: room-layout.glb planned with no network access'
];

function triggerImageDryRun() {
  notifyInfo('Image dry run planned: prompt, seed, and output path validated.');
}

function triggerMusicQueue() {
  notifySuccess('Music batch queued: 3 ACE-Step jobs staged from jobs.example.json.');
}

function triggerGlbExport() {
  notifySuccess('GLB export preview ready: procedural room asset would be written locally.');
}

function triggerFailedRender() {
  notifyError('Render failed: missing local checkpoint. Demo stayed static and credential-free.');
}

function Workbench() {
  const { confirm, showInfo } = useNotificationActions();

  const runDeleteConfirm = useCallback(async () => {
    const ok = await confirm('Delete the staged dry-run asset from the queue?');
    showInfo(ok ? 'Staged asset removed from the demo queue.' : 'Delete cancelled; staged asset kept.');
  }, [confirm, showInfo]);

  return (
    <main style={styles.page}>
      <section style={styles.header}>
        <div>
          <p style={styles.eyebrow}>Cross Repo Libs</p>
          <h1 style={styles.title}>Library Workbench</h1>
          <p style={styles.subtitle}>
            A static portfolio demo for shared notification UI and local AI asset tooling. The workbench shows how
            image, music, 3D, refinement, and common runtime packages can coordinate without API keys, local models, or
            backend services.
          </p>
        </div>
        <div style={styles.headerPanel} aria-label="Workbench status">
          <span style={styles.statusDot} />
          <span>Static demo mode</span>
        </div>
      </section>

      <section style={styles.grid}>
        <div style={styles.demoPanel}>
          <div style={styles.sectionHeading}>
            <p style={styles.eyebrow}>Live notification demo</p>
            <h2 style={styles.heading}>Asset pipeline actions</h2>
          </div>
          <p style={styles.bodyText}>
            These controls use the shared notification bridge and confirm stack with realistic portfolio actions. Every
            action is simulated locally, so the app stays runnable offline.
          </p>
          <div style={styles.actions}>
            <button style={styles.primaryButton} type="button" onClick={triggerImageDryRun}>
              Image dry run
            </button>
            <button style={styles.button} type="button" onClick={triggerMusicQueue}>
              Music batch queue
            </button>
            <button style={styles.button} type="button" onClick={triggerGlbExport}>
              GLB export
            </button>
            <button style={styles.dangerButton} type="button" onClick={triggerFailedRender}>
              Failed render
            </button>
            <button style={styles.button} type="button" onClick={() => void runDeleteConfirm()}>
              Confirm delete
            </button>
            <button
              style={styles.button}
              type="button"
              onClick={() => notifyWarning('Refinement routed to local model: no cloud token configured.')}
            >
              Local route warning
            </button>
          </div>
        </div>

        <aside style={styles.logPanel}>
          <div style={styles.sectionHeading}>
            <p style={styles.eyebrow}>Sample output</p>
            <h2 style={styles.heading}>Dry-run transcript</h2>
          </div>
          <pre style={styles.log}>{sampleLog.join('\n')}</pre>
        </aside>
      </section>

      <section style={styles.packageSection} aria-labelledby="packages-heading">
        <div style={styles.sectionHeading}>
          <p style={styles.eyebrow}>Workspace packages</p>
          <h2 id="packages-heading" style={styles.heading}>
            Reusable library surface
          </h2>
        </div>
        <div style={styles.packageGrid}>
          {packages.map((pkg) => (
            <article key={pkg.name} style={styles.card}>
              <div style={styles.cardTop}>
                <h3 style={styles.cardTitle}>{pkg.name}</h3>
                <span style={styles.badge}>{pkg.status}</span>
              </div>
              <p style={styles.cardLabel}>{pkg.label}</p>
              <p style={styles.cardText}>{pkg.detail}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    boxSizing: 'border-box',
    padding: '40px clamp(18px, 5vw, 64px)',
    background: '#f7f8fb',
    color: '#17202a',
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  },
  header: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 24,
    maxWidth: 1180,
    margin: '0 auto 28px'
  },
  eyebrow: {
    margin: '0 0 8px',
    color: '#596579',
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 0,
    textTransform: 'uppercase'
  },
  title: {
    margin: 0,
    fontSize: 'clamp(36px, 6vw, 68px)',
    lineHeight: 0.95,
    letterSpacing: 0
  },
  subtitle: {
    maxWidth: 760,
    margin: '18px 0 0',
    color: '#3f4b5e',
    fontSize: 18,
    lineHeight: 1.6
  },
  headerPanel: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    flex: '0 0 auto',
    marginTop: 12,
    padding: '10px 12px',
    border: '1px solid #d8dee8',
    borderRadius: 8,
    background: '#ffffff',
    color: '#263241',
    fontSize: 14,
    fontWeight: 700
  },
  statusDot: {
    width: 9,
    height: 9,
    borderRadius: 999,
    background: '#1f9d68'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
    gap: 18,
    maxWidth: 1180,
    margin: '0 auto 18px'
  },
  demoPanel: {
    padding: 24,
    border: '1px solid #d8dee8',
    borderRadius: 8,
    background: '#ffffff'
  },
  logPanel: {
    padding: 24,
    border: '1px solid #d8dee8',
    borderRadius: 8,
    background: '#111827',
    color: '#f8fafc'
  },
  sectionHeading: {
    marginBottom: 14
  },
  heading: {
    margin: 0,
    fontSize: 24,
    lineHeight: 1.15,
    letterSpacing: 0
  },
  bodyText: {
    margin: '0 0 20px',
    color: '#4a5668',
    lineHeight: 1.55
  },
  actions: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 10
  },
  button: {
    minHeight: 40,
    padding: '0 14px',
    border: '1px solid #c8d0dc',
    borderRadius: 8,
    background: '#ffffff',
    color: '#1d2734',
    font: 'inherit',
    fontWeight: 700,
    cursor: 'pointer'
  },
  primaryButton: {
    minHeight: 40,
    padding: '0 14px',
    border: '1px solid #2457c5',
    borderRadius: 8,
    background: '#2457c5',
    color: '#ffffff',
    font: 'inherit',
    fontWeight: 800,
    cursor: 'pointer'
  },
  dangerButton: {
    minHeight: 40,
    padding: '0 14px',
    border: '1px solid #b42318',
    borderRadius: 8,
    background: '#fff7f6',
    color: '#9f1f17',
    font: 'inherit',
    fontWeight: 800,
    cursor: 'pointer'
  },
  log: {
    overflowX: 'auto',
    margin: 0,
    padding: 16,
    borderRadius: 8,
    background: '#0b1020',
    color: '#d7f7e8',
    fontSize: 13,
    lineHeight: 1.7,
    whiteSpace: 'pre-wrap'
  },
  packageSection: {
    maxWidth: 1180,
    margin: '0 auto',
    padding: 24,
    border: '1px solid #d8dee8',
    borderRadius: 8,
    background: '#ffffff'
  },
  packageGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
    gap: 14
  },
  card: {
    padding: 18,
    border: '1px solid #e1e6ef',
    borderRadius: 8,
    background: '#fbfcff'
  },
  cardTop: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12
  },
  cardTitle: {
    margin: 0,
    color: '#17202a',
    fontSize: 18,
    letterSpacing: 0
  },
  badge: {
    flex: '0 0 auto',
    maxWidth: 120,
    padding: '4px 7px',
    borderRadius: 999,
    background: '#e9f2ff',
    color: '#2457c5',
    fontSize: 11,
    fontWeight: 800,
    lineHeight: 1.2,
    textAlign: 'center'
  },
  cardLabel: {
    margin: '14px 0 8px',
    color: '#263241',
    fontWeight: 800
  },
  cardText: {
    margin: 0,
    color: '#566275',
    lineHeight: 1.5
  }
} satisfies Record<string, CSSProperties>;

export function App() {
  return (
    <NotificationHost>
      <Workbench />
    </NotificationHost>
  );
}
