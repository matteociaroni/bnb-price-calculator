import type { ChangeEvent } from 'react'

export type InputFieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
  ariaLabel?: string
  prefix?: string
  suffix?: string
  hint?: string
}

export function InputField({
  label,
  value,
  onChange,
  ariaLabel,
  prefix,
  suffix,
  hint,
}: InputFieldProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  return (
    <label className="field">
      <span>{label}</span>
      <div className="inputWrap">
        {prefix && <span className="prefix">{prefix}</span>}
        <input inputMode="decimal" value={value} onChange={handleChange} aria-label={ariaLabel ?? label} />
        {suffix && <span className="suffix">{suffix}</span>}
      </div>
      {hint && <span className="hint">{hint}</span>}
    </label>
  )
}

