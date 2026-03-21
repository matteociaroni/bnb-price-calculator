import { useEffect, useId, useRef, type KeyboardEvent, type ReactNode } from 'react'

type ModalPanelProps = {
  isOpen: boolean
  onClose: () => void
  closeButtonLabel: string
  title: string
  subtitle?: string
  className?: string
  children: ReactNode
}

export function ModalPanel({
  isOpen,
  onClose,
  closeButtonLabel,
  title,
  subtitle,
  className,
  children,
}: ModalPanelProps) {
  const panelRef = useRef<HTMLElement | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)
  const previousFocusedRef = useRef<HTMLElement | null>(null)
  const titleId = useId()

  useEffect(() => {
    if (!isOpen) return
    previousFocusedRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    closeButtonRef.current?.focus()

    return () => {
      previousFocusedRef.current?.focus()
    }
  }, [isOpen])

  const getFocusableElements = () => {
    if (!panelRef.current) return []
    return Array.from(
      panelRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    )
  }

  const handlePanelKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Escape') {
      event.stopPropagation()
      onClose()
      return
    }

    if (event.key !== 'Tab') return
    const focusableElements = getFocusableElements()
    if (focusableElements.length === 0) return

    const first = focusableElements[0]
    const last = focusableElements[focusableElements.length - 1]
    const activeElement = document.activeElement

    if (event.shiftKey && activeElement === first) {
      event.preventDefault()
      last.focus()
      return
    }

    if (!event.shiftKey && activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  if (!isOpen) return null

  return (
    <div className="paramsOverlay" onClick={onClose}>
      <aside
        ref={panelRef}
        className={`card parametersDrawer${className ? ` ${className}` : ''}`}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handlePanelKeyDown}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="cardHeader">
          <div>
            {subtitle && <span className="pillLabel">{subtitle}</span>}
            <h2 id={titleId}>{title}</h2>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            className="paramsClose"
            onClick={onClose}
            aria-label={closeButtonLabel}
          >
            ×
          </button>
        </div>

        {children}
      </aside>
    </div>
  )
}
