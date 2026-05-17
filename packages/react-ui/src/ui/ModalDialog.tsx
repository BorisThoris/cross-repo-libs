import { useEffect, useRef, type ReactNode } from 'react';

const FOCUSABLE_SELECTOR = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export interface ModalDialogProps {
  ariaLabel?: string;
  children: ReactNode;
  footer?: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  showCloseButton?: boolean;
  title?: ReactNode;
}

export function ModalDialog({
  ariaLabel,
  children,
  footer,
  isOpen,
  onClose,
  showCloseButton = true,
  title
}: ModalDialogProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const previousActiveElementRef = useRef<Element | null>(null);

  useEffect(() => {
    if (!isOpen) return undefined;
    previousActiveElementRef.current = document.activeElement;
    const panel = panelRef.current;
    const focusables = panel?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR) ?? [];
    focusables[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
        return;
      }
      if (event.key !== 'Tab' || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    panel?.addEventListener('keydown', handleKeyDown);
    return () => {
      panel?.removeEventListener('keydown', handleKeyDown);
      const previous = previousActiveElementRef.current;
      if (previous instanceof HTMLElement) previous.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="crui-modal" onMouseDown={(event) => event.currentTarget === event.target && onClose()}>
      <div
        aria-label={ariaLabel}
        aria-modal="true"
        className="crui-modal__panel"
        ref={panelRef}
        role="dialog"
      >
        {showCloseButton ? (
          <button aria-label="Close dialog" className="crui-modal__close" onClick={onClose} type="button">
            x
          </button>
        ) : null}
        {title ? <div className="crui-modal__title">{title}</div> : null}
        <div className="crui-modal__body">{children}</div>
        {footer ? <div className="crui-modal__footer">{footer}</div> : null}
      </div>
    </div>
  );
}
