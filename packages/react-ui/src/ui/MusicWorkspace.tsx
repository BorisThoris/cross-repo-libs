import type { ButtonHTMLAttributes } from 'react';

export interface TransportControlsProps {
  isPlaying?: boolean;
  onNext?: () => void;
  onPlayPause?: () => void;
  onPrevious?: () => void;
  onStop?: () => void;
}

export function TransportControls({
  isPlaying = false,
  onNext,
  onPlayPause,
  onPrevious,
  onStop
}: TransportControlsProps) {
  return (
    <div aria-label="Transport controls" className="crui-transport" role="group">
      <button aria-label="Previous" onClick={onPrevious} type="button">|&lt;</button>
      <button aria-label={isPlaying ? 'Pause' : 'Play'} className="crui-transport__primary" onClick={onPlayPause} type="button">
        {isPlaying ? '||' : '>'}
      </button>
      <button aria-label="Stop" onClick={onStop} type="button">[]</button>
      <button aria-label="Next" onClick={onNext} type="button">&gt;|</button>
    </div>
  );
}

export interface LevelMeterProps {
  label?: string;
  peak?: number;
  value: number;
}

export function LevelMeter({ label = 'Level', peak, value }: LevelMeterProps) {
  const normalized = Math.max(0, Math.min(1, value));
  const peakPosition = peak === undefined ? undefined : `${Math.max(0, Math.min(1, peak)) * 100}%`;

  return (
    <div className="crui-level-meter">
      <div className="crui-level-meter__top">
        <span>{label}</span>
        <strong>{Math.round(normalized * 100)}%</strong>
      </div>
      <div aria-label={label} aria-valuemax={100} aria-valuemin={0} aria-valuenow={Math.round(normalized * 100)} className="crui-level-meter__track" role="meter">
        <span style={{ width: `${normalized * 100}%` }} />
        {peakPosition ? <i style={{ left: peakPosition }} /> : null}
      </div>
    </div>
  );
}

export interface StepGridProps {
  activeStep?: number;
  onStepToggle?: (step: number, active: boolean) => void;
  steps: readonly boolean[];
}

export function StepGrid({ activeStep = 0, onStepToggle, steps }: StepGridProps) {
  return (
    <div aria-label="Step sequence" className="crui-step-grid" role="group">
      {steps.map((isActive, index) => (
        <button
          aria-label={`Step ${index + 1}`}
          aria-pressed={isActive}
          className={[
            'crui-step-grid__step',
            isActive ? 'crui-step-grid__step--active' : '',
            activeStep === index ? 'crui-step-grid__step--current' : ''
          ].filter(Boolean).join(' ')}
          key={`step-${index}`}
          onClick={() => onStepToggle?.(index, !isActive)}
          type="button"
        />
      ))}
    </div>
  );
}

export interface MiniTimelineMarker {
  label: string;
  position: number;
}

export interface MiniTimelineProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  markers?: readonly MiniTimelineMarker[];
  progress: number;
}

export function MiniTimeline({ markers = [], progress, ...rest }: MiniTimelineProps) {
  const normalized = Math.max(0, Math.min(1, progress));

  return (
    <button aria-label="Timeline" className="crui-mini-timeline" type="button" {...rest}>
      <span className="crui-mini-timeline__fill" style={{ width: `${normalized * 100}%` }} />
      {markers.map((marker) => (
        <span
          className="crui-mini-timeline__marker"
          key={marker.label}
          style={{ left: `${Math.max(0, Math.min(1, marker.position)) * 100}%` }}
          title={marker.label}
        />
      ))}
    </button>
  );
}
