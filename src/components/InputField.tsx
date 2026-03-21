import type { ChangeEvent } from 'react'

export type InputFieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
  ariaLabel?: string
  prefix?: string
  suffix?: string
  tooltip?: string
}

export function InputField({
  label,
  value,
  onChange,
  ariaLabel,
  prefix,
  suffix,
  tooltip,
}: InputFieldProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  return (
    <label className="field">
      <span>{label}</span>
      <div className="inputWrap">
        {prefix && <span className="prefix">{prefix}</span>}
        <input
          inputMode="decimal"
          value={value}
          onChange={handleChange}
          aria-label={ariaLabel ?? label}
          title={tooltip}
        />
        {suffix && <span className="suffix">{suffix}</span>}
      </div>
    </label>
  )
}
