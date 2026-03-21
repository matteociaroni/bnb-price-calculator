import type { Dispatch, SetStateAction } from 'react'
import { InputField } from './InputField'

export type ParametersPanelProps = {
  isOpen: boolean
  onClose: () => void
  vatPctInput: string
  setVatPctInput: Dispatch<SetStateAction<string>>
  flatTaxPctInput: string
  setFlatTaxPctInput: Dispatch<SetStateAction<string>>
  airbnbGuestFeePctInput: string
  setAirbnbGuestFeePctInput: Dispatch<SetStateAction<string>>
  airbnbHostFeePctInput: string
  setAirbnbHostFeePctInput: Dispatch<SetStateAction<string>>
  bookingHostFeePctInput: string
  setBookingHostFeePctInput: Dispatch<SetStateAction<string>>
  bookingTransactionFeePctInput: string
  setBookingTransactionFeePctInput: Dispatch<SetStateAction<string>>
}

type ParameterField = {
  key: string
  label: string
  value: string
  onChange: Dispatch<SetStateAction<string>>
}

export function ParametersPanel({
  isOpen,
  onClose,
  vatPctInput,
  setVatPctInput,
  flatTaxPctInput,
  setFlatTaxPctInput,
  airbnbGuestFeePctInput,
  setAirbnbGuestFeePctInput,
  airbnbHostFeePctInput,
  setAirbnbHostFeePctInput,
  bookingHostFeePctInput,
  setBookingHostFeePctInput,
  bookingTransactionFeePctInput,
  setBookingTransactionFeePctInput,
}: ParametersPanelProps) {
  if (!isOpen) return null

  const globalFields: ParameterField[] = [
    { key: 'vatPct', label: 'VAT percentage', value: vatPctInput, onChange: setVatPctInput },
    { key: 'flatTaxPct', label: 'Flat tax on rental income', value: flatTaxPctInput, onChange: setFlatTaxPctInput },
  ]

  const airbnbFields: ParameterField[] = [
    { key: 'airbnbGuestFeePct', label: 'Guest fee', value: airbnbGuestFeePctInput, onChange: setAirbnbGuestFeePctInput },
    { key: 'airbnbHostFeePct', label: 'Host fee', value: airbnbHostFeePctInput, onChange: setAirbnbHostFeePctInput },
  ]

  const bookingFields: ParameterField[] = [
    { key: 'bookingHostFeePct', label: 'Host fee', value: bookingHostFeePctInput, onChange: setBookingHostFeePctInput },
    {
      key: 'bookingTransactionFeePct',
      label: 'Transaction fee',
      value: bookingTransactionFeePctInput,
      onChange: setBookingTransactionFeePctInput,
    },
  ]

  return (
    <div className="paramsOverlay" onClick={onClose}>
      <aside
        className="card parametersDrawer"
        onClick={(e) => e.stopPropagation()}
        aria-label="Parameters panel"
      >
        <div className="cardHeader">
          <h2>Parameters</h2>
          <button type="button" className="paramsClose" onClick={onClose} aria-label="Close parameters panel">
            ×
          </button>
        </div>

        <div className="grid">
          <div className="feesRow">
            {globalFields.map((field) => (
              <InputField key={field.key} label={field.label} value={field.value} onChange={field.onChange} suffix="%" />
            ))}
          </div>

          <div className="sectionLabel">Airbnb fees</div>

          <div className="feesRow">
            {airbnbFields.map((field) => (
              <InputField key={field.key} label={field.label} value={field.value} onChange={field.onChange} suffix="%" />
            ))}
          </div>

          <div className="sectionLabel">Booking fees</div>

          <div className="feesRow">
            {bookingFields.map((field) => (
              <InputField key={field.key} label={field.label} value={field.value} onChange={field.onChange} suffix="%" />
            ))}
          </div>
        </div>
      </aside>
    </div>
  )
}
