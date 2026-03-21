import type { ReactNode } from 'react'

type ModalPanelProps = {
  isOpen: boolean
  onClose: () => void
  ariaLabel: string
  title: string
  subtitle?: string
  className?: string
  children: ReactNode
}

export function ModalPanel({
  isOpen,
  onClose,
  ariaLabel,
  title,
  subtitle,
  className,
  children,
}: ModalPanelProps) {
  if (!isOpen) return null

  return (
    <div className="paramsOverlay" onClick={onClose}>
      <aside
        className={`card parametersDrawer${className ? ` ${className}` : ''}`}
        onClick={(e) => e.stopPropagation()}
        aria-label={ariaLabel}
      >
        <div className="cardHeader">
          <div>
            {subtitle && <span className="pillLabel">{subtitle}</span>}
            <h2>{title}</h2>
          </div>
          <button type="button" className="paramsClose" onClick={onClose} aria-label={`Close ${ariaLabel}`}>
            ×
          </button>
        </div>

        {children}
      </aside>
    </div>
  )
}
