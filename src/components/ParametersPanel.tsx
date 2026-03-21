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
  tooltip: string
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
    {
      key: 'vatPct',
      label: 'VAT percentage',
      value: vatPctInput,
      onChange: setVatPctInput,
      tooltip: 'VAT percentage applied to platform fees charged to the host.',
    },
    {
      key: 'flatTaxPct',
      label: 'Flat tax on rental income',
      value: flatTaxPctInput,
      onChange: setFlatTaxPctInput,
      tooltip: 'Flat tax percentage applied to accommodation income.',
    },
  ]

  const airbnbFields: ParameterField[] = [
    {
      key: 'airbnbGuestFeePct',
      label: 'Guest fee',
      value: airbnbGuestFeePctInput,
      onChange: setAirbnbGuestFeePctInput,
      tooltip: 'Airbnb fee percentage added to what the guest pays.',
    },
    {
      key: 'airbnbHostFeePct',
      label: 'Host fee',
      value: airbnbHostFeePctInput,
      onChange: setAirbnbHostFeePctInput,
      tooltip: 'Airbnb fee percentage deducted from host accommodation revenue.',
    },
  ]

  const bookingFields: ParameterField[] = [
    {
      key: 'bookingHostFeePct',
      label: 'Host fee',
      value: bookingHostFeePctInput,
      onChange: setBookingHostFeePctInput,
      tooltip: 'Booking commission percentage deducted from host accommodation revenue.',
    },
    {
      key: 'bookingTransactionFeePct',
      label: 'Transaction fee',
      value: bookingTransactionFeePctInput,
      onChange: setBookingTransactionFeePctInput,
      tooltip: 'Additional Booking payment processing fee percentage.',
    },
  ]

  return (
    <ModalPanel isOpen={isOpen} onClose={onClose} ariaLabel="Parameters panel" title="Parameters">
      <div className="grid">
        <div className="feesRow">
          {globalFields.map((field) => (
            <InputField
              key={field.key}
              label={field.label}
              value={field.value}
              onChange={field.onChange}
              suffix="%"
              tooltip={field.tooltip}
            />
          ))}
        </div>

        <div className="sectionLabel">Airbnb fees</div>

        <div className="feesRow">
          {airbnbFields.map((field) => (
            <InputField
              key={field.key}
              label={field.label}
              value={field.value}
              onChange={field.onChange}
              suffix="%"
              tooltip={field.tooltip}
            />
          ))}
        </div>

        <div className="sectionLabel">Booking fees</div>

        <div className="feesRow">
          {bookingFields.map((field) => (
            <InputField
              key={field.key}
              label={field.label}
              value={field.value}
              onChange={field.onChange}
              suffix="%"
              tooltip={field.tooltip}
            />
          ))}
        </div>
      </div>
    </ModalPanel>
  )
}
