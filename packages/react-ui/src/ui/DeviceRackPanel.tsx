import type { ReactNode } from 'react';

export type DeviceRackHealth = 'ok' | 'info' | 'warning';

export interface DeviceRackParameter {
  automated?: boolean;
  label: string;
  value: ReactNode;
}

export interface DeviceRackPlugin {
  bypassed?: boolean;
  health?: DeviceRackHealth;
  id: string;
  latency?: string;
  name: string;
  parameters?: readonly DeviceRackParameter[];
  slotLabel?: string;
  vendor?: string;
}

export interface DeviceRackStage {
  id: string;
  label: string;
  value: string;
  warning?: boolean;
}

export interface DeviceRackPanelProps {
  plugins: readonly DeviceRackPlugin[];
  selectedPluginId?: string;
  stages?: readonly DeviceRackStage[];
  subtitle?: string;
  telemetry?: readonly string[];
  title?: string;
}

const defaultStages: readonly DeviceRackStage[] = [
  { id: 'input', label: 'Input', value: 'Track' },
  { id: 'instrument', label: 'Instrument', value: 'Sampler' },
  { id: 'effects', label: 'Effects', value: 'Rack' },
  { id: 'output', label: 'Output', value: 'Master' }
];

function healthLabel(health: DeviceRackHealth | undefined) {
  if (health === 'warning') {
    return 'Watch';
  }

  if (health === 'info') {
    return 'Active';
  }

  return 'Stable';
}

export function DeviceRackPanel({
  plugins,
  selectedPluginId,
  stages = defaultStages,
  subtitle = 'Track effects',
  telemetry = ['CPU 14%', '0.7 ms latency', 'Automation ready'],
  title = 'Device Rack'
}: DeviceRackPanelProps) {
  return (
    <section className="crui-device-rack" aria-label={title}>
      <header className="crui-device-rack__header">
        <div>
          <span>{subtitle}</span>
          <strong>{title}</strong>
        </div>
        <small>{plugins.length} devices</small>
      </header>
      <div className="crui-device-rack__flow" aria-label="Signal flow">
        {stages.map((stage, index) => (
          <span className="crui-device-rack__flow-item" key={stage.id}>
            <span className={`crui-device-rack__stage ${stage.warning ? 'crui-device-rack__stage--warning' : ''}`}>
              <small>{stage.label}</small>
              <strong>{stage.value}</strong>
            </span>
            {index < stages.length - 1 ? <span className="crui-device-rack__arrow" aria-hidden="true">-&gt;</span> : null}
          </span>
        ))}
      </div>
      <div className="crui-device-rack__telemetry">
        {telemetry.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
      <div className="crui-device-rack__plugins">
        {plugins.map((plugin, index) => (
          <article
            className={`crui-device-card ${plugin.id === selectedPluginId ? 'crui-device-card--selected' : ''} ${plugin.bypassed ? 'crui-device-card--bypassed' : ''}`}
            key={plugin.id}
          >
            <header className="crui-device-card__header">
              <div>
                <span>{plugin.slotLabel ?? `Slot ${index + 1}`}</span>
                <strong>{plugin.name}</strong>
              </div>
              <span className={`crui-device-card__health crui-device-card__health--${plugin.health ?? 'ok'}`}>
                {plugin.bypassed ? 'Bypassed' : healthLabel(plugin.health)}
              </span>
            </header>
            <div className="crui-device-card__meta">
              {plugin.vendor ? <span>{plugin.vendor}</span> : null}
              {plugin.latency ? <span>{plugin.latency}</span> : null}
            </div>
            {plugin.parameters?.length ? (
              <div className="crui-device-card__params">
                {plugin.parameters.map((parameter) => (
                  <div className="crui-device-card__param" key={parameter.label}>
                    <span>{parameter.label}</span>
                    <strong>{parameter.value}</strong>
                    {parameter.automated ? <small>Auto</small> : null}
                  </div>
                ))}
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
