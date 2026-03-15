export type GuestSliderProps = {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  label?: string
  ariaLabel?: string
}

export function GuestSlider({
  value,
  onChange,
  min = 1,
  max = 10,
  label = 'Guests',
  ariaLabel,
}: GuestSliderProps) {
  const effectiveAriaLabel = ariaLabel ?? `Number of ${label.toLowerCase()}`

  return (
    <label className="field">
      <span>{label}</span>
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
        />
        <div className="pill" aria-label={`${label} selected: ${value}`}>
          {value}
        </div>
      </div>
      {/* hint range rimosso per pulire la UI */}
    </label>
  )
}
