import { InputField } from './InputField'
import { ModalPanel } from './ModalPanel'

type StringSetter = (value: string) => void

export type ParametersPanelProps = {
  isOpen: boolean
  onClose: () => void
  vatPctInput: string
  setVatPctInput: StringSetter
  flatTaxPctInput: string
  setFlatTaxPctInput: StringSetter
  airbnbGuestFeePctInput: string
  setAirbnbGuestFeePctInput: StringSetter
  airbnbHostFeePctInput: string
  setAirbnbHostFeePctInput: StringSetter
  bookingHostFeePctInput: string
  setBookingHostFeePctInput: StringSetter
  bookingTransactionFeePctInput: string
  setBookingTransactionFeePctInput: StringSetter
}

type ParameterField = {
  key: string
  label: string
  value: string
  onChange: StringSetter
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
    <ModalPanel isOpen={isOpen} onClose={onClose} ariaLabel="Parameters panel" title="Parameters">
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
    </ModalPanel>
  )
}
