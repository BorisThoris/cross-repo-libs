import type { ReactNode } from 'react';
import { Button, type ButtonSize, type ButtonVariant } from './Button.js';

export type OverlayActionPlacement = 'rail' | 'dock';

export interface OverlayAction {
  disabled?: boolean;
  label: string;
  onClick: () => void;
  variant?: Extract<ButtonVariant, 'primary' | 'secondary' | 'danger'>;
}

export interface OverlayActionDockProps {
  actions: readonly OverlayAction[];
  actionClassName?: string;
  className?: string;
  leading?: ReactNode;
  placement: OverlayActionPlacement;
  size?: ButtonSize;
  testId?: string;
}

const isPrimaryAction = (action: OverlayAction) => (action.variant ?? 'primary') === 'primary';

export function OverlayActionDock({
  actions,
  actionClassName = '',
  className = '',
  leading,
  placement,
  size = 'md',
  testId = 'overlay-action-dock'
}: OverlayActionDockProps) {
  const secondaryActions = actions.filter((action) => !isPrimaryAction(action));
  const primaryActions = actions.filter(isPrimaryAction);

  const renderAction = (action: OverlayAction, index: number) => (
    <Button
      className={actionClassName}
      disabled={action.disabled}
      key={`${action.label}:${index}`}
      onClick={action.onClick}
      size={size}
      variant={action.variant ?? 'primary'}
    >
      {action.label}
    </Button>
  );

  if (placement === 'rail') {
    return (
      <div
        className={['crui-action-dock', 'crui-action-dock--rail', className].filter(Boolean).join(' ')}
        data-action-placement={placement}
        data-testid={testId}
      >
        {actions.map(renderAction)}
      </div>
    );
  }

  return (
    <div
      className={['crui-action-dock', 'crui-action-dock--dock', className].filter(Boolean).join(' ')}
      data-action-placement={placement}
      data-testid={testId}
    >
      {leading ? <div className="crui-action-dock__leading">{leading}</div> : null}
      <div className="crui-action-dock__secondary">{secondaryActions.map(renderAction)}</div>
      <div className="crui-action-dock__primary">{primaryActions.map(renderAction)}</div>
    </div>
  );
}
