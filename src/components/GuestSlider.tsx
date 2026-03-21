import type { ReactNode } from 'react'

export type GuestSliderProps = {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  label?: string
  icon?: ReactNode
  ariaLabel?: string
  tooltip?: string
}

export function GuestSlider({
  value,
  onChange,
  min = 1,
  max = 10,
  label = 'Guests',
  icon,
  ariaLabel,
  tooltip,
}: GuestSliderProps) {
  const effectiveAriaLabel = ariaLabel ?? `Number of ${label.toLowerCase()}`

  return (
    <label className="field">
      <span className="fieldLabel">
        {icon && <span className="fieldLabelIcon">{icon}</span>}
        <span>{label}</span>
      </span>
      <div className="sliderRow">
        <input
          className="slider"
          type="range"
          min={min}
          max={max}
          step={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label={effectiveAriaLabel}
          title={tooltip}
        />
        <div className="pill" aria-label={`${label} selected: ${value}`}>
          {value}
        </div>
      </div>
    </label>
  )
}
