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
            <InputField
              label="VAT percentage"
              value={vatPctInput}
              onChange={setVatPctInput}
              suffix="%"
            />

            <InputField
              label="Flat tax on rental income"
              value={flatTaxPctInput}
              onChange={setFlatTaxPctInput}
              suffix="%"
            />
          </div>

          <div className="sectionLabel">Airbnb fees</div>

          <div className="feesRow">
            <InputField
              label="Guest fee"
              value={airbnbGuestFeePctInput}
              onChange={setAirbnbGuestFeePctInput}
              suffix="%"
            />

            <InputField
              label="Host fee"
              value={airbnbHostFeePctInput}
              onChange={setAirbnbHostFeePctInput}
              suffix="%"
            />
          </div>

          <div className="sectionLabel">Booking fees</div>

          <div className="feesRow">
            <InputField
              label="Host fee"
              value={bookingHostFeePctInput}
              onChange={setBookingHostFeePctInput}
              suffix="%"
            />

            <InputField
              label="Transaction fee"
              value={bookingTransactionFeePctInput}
              onChange={setBookingTransactionFeePctInput}
              suffix="%"
            />
          </div>
        </div>
      </aside>
    </div>
  )
}
