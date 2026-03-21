import { useMemo, useState, type ReactNode } from 'react'
import { InputField } from './InputField'
import type { PlatformResults } from '../calculations'

/**
 * Describes a single rate row with precomputed results for a platform.
 * Percentual fields in {@link results} are already applied to the numeric amounts.
 */
export type TariffRow = {
  key: string
  label: string
  basePrice: number
  otherGuestPrice: number
  basePriceBeforeDiscount: number
  results: PlatformResults
}

/**
 * Shared props for the platform calculator.
 * - Monetary inputs (`basePrice*`, `otherGuestPrice*`) are EUR values entered by the host.
 * - Discount and fee values (all percentages) should be raw numbers, e.g. "3" for 3%.
 */
export type PlatformCalculatorProps = {
  name: 'Airbnb' | 'Booking'
  basePriceInput: string
  setBasePriceInput: (value: string) => void
  otherGuestPriceInput: string
  setOtherGuestPriceInput: (value: string) => void
  guests: number
  nights: number
  currency: Intl.NumberFormat
  tariffs: TariffRow[]
  nonRefundableDiscountInput: string
  setNonRefundableDiscountInput: (value: string) => void
  showTitle?: boolean
  headerAdornment?: ReactNode
}

type DerivedAmounts = {
  perNightTextBeforeDiscount: string
  perNightTextAfterDiscount: string
  rawBasePlusExtras: number
  rawBasePlusExtrasBeforeDiscount: number
  baseDiscountTotal: number
  baseDiscountFormula: string
  geniusDiscountAmount: number
  geniusDiscountPct: number
  hostFeePct: number
  vatPct: number
  flatTaxPct: number
  guestExtraOverBase: number
  guestFeePct: number
}

type UseDerivedArgs = {
  tariffs: TariffRow[]
  guestCount: number
  nightCount: number
  currency: Intl.NumberFormat
  isBooking: boolean
}

function useDerivedAmounts({ tariffs, guestCount, nightCount, currency, isBooking }: UseDerivedArgs) {
  return useMemo(() => {
    const map: Record<string, DerivedAmounts> = {}

    tariffs.forEach((tariff) => {
      const originalBasePrice = tariff.basePriceBeforeDiscount ?? tariff.basePrice
      const extraPerNight = Math.max(0, guestCount - 1) * tariff.otherGuestPrice
      const perNightBeforeDiscount = originalBasePrice + extraPerNight
      const perNightAfterDiscount = tariff.basePrice + extraPerNight
      const perNightTextBeforeDiscount = `(${currency.format(originalBasePrice)} + ${Math.max(0, guestCount - 1)} × ${currency.format(
        tariff.otherGuestPrice,
      )})`
      const perNightTextAfterDiscount = `(${currency.format(tariff.basePrice)} + ${Math.max(0, guestCount - 1)} × ${currency.format(
        tariff.otherGuestPrice,
      )})`
      const rawBasePlusExtrasBeforeDiscount = perNightBeforeDiscount * nightCount
      const rawBasePlusExtras = perNightAfterDiscount * nightCount
      const baseDiscountPerNight = Math.max(0, originalBasePrice - tariff.basePrice)
      const baseDiscountTotal = baseDiscountPerNight * nightCount
      const baseDiscountPct =
        originalBasePrice > 0 && baseDiscountPerNight > 0 ? (baseDiscountPerNight / originalBasePrice) * 100 : 0
      const baseDiscountFormula =
        baseDiscountPct > 0
          ? `${currency.format(originalBasePrice)} × ${baseDiscountPct.toFixed(2)}% × ${nightCount}`
          : ''
      const hostBasePlusExtras = tariff.results.host.basePlusExtras
      const geniusDiscountAmount = isBooking ? rawBasePlusExtras - hostBasePlusExtras : 0
      const geniusDiscountPct = geniusDiscountAmount > 0 ? (geniusDiscountAmount / rawBasePlusExtras) * 100 : 0
      const hostFeePct = hostBasePlusExtras > 0 ? (tariff.results.host.hostFees / hostBasePlusExtras) * 100 : 0
      const vatPct = tariff.results.host.hostFees > 0 ? (tariff.results.host.vatOnHostFees / tariff.results.host.hostFees) * 100 : 0
      const flatTaxPct = hostBasePlusExtras > 0 ? (tariff.results.host.flatTax / hostBasePlusExtras) * 100 : 0
      const guestExtraOverBase = tariff.results.guest.platformPrice - hostBasePlusExtras
      const guestFeePct = !isBooking && hostBasePlusExtras > 0 ? (guestExtraOverBase / hostBasePlusExtras) * 100 : 0

      map[tariff.key] = {
        perNightTextBeforeDiscount,
        perNightTextAfterDiscount,
        rawBasePlusExtras,
        rawBasePlusExtrasBeforeDiscount,
        baseDiscountTotal,
        baseDiscountFormula,
        geniusDiscountAmount,
        geniusDiscountPct,
        hostFeePct,
        vatPct,
        flatTaxPct,
        guestExtraOverBase,
        guestFeePct,
      }
    })

    return map
  }, [tariffs, guestCount, nightCount, currency, isBooking])
}

type BreakdownRowProps = {
  label: string
  value: string
  formula?: string
  emphasis?: boolean
}

const BreakdownRow = ({ label, value, formula, emphasis = false }: BreakdownRowProps) => (
  <div className="resultRow detailRow">
    <div>
      <div className="resultLabel">{label}</div>
      {formula && <div className="resultFormula">{formula}</div>}
    </div>
    <div className={`resultValue${emphasis ? ' emphasis' : ''}`}>{value}</div>
  </div>
)

function PriceInputs({
  name,
  basePriceInput,
  setBasePriceInput,
  otherGuestPriceInput,
  setOtherGuestPriceInput,
  nonRefundableDiscountInput,
  setNonRefundableDiscountInput,
}: Pick<
  PlatformCalculatorProps,
  'name' | 'basePriceInput' | 'setBasePriceInput' | 'otherGuestPriceInput' | 'setOtherGuestPriceInput' | 'nonRefundableDiscountInput' | 'setNonRefundableDiscountInput'
>) {
  const priceFields = [
    {
      key: 'basePrice',
      label: '💶 Base price',
      value: basePriceInput,
      onChange: setBasePriceInput,
      prefix: '€',
      ariaLabel: `Base price for ${name}`,
    },
    {
      key: 'otherGuestPrice',
      label: '➕👤 Other guest price',
      value: otherGuestPriceInput,
      onChange: setOtherGuestPriceInput,
      prefix: '€',
      ariaLabel: `Other guest price for ${name}`,
    },
  ] as const

  return (
    <div className="grid">
      <div className="feesRow">
        {priceFields.map((field) => (
          <InputField
            key={field.key}
            label={field.label}
            value={field.value}
            onChange={field.onChange}
            prefix={field.prefix}
            ariaLabel={field.ariaLabel}
          />
        ))}
      </div>

      <InputField
        label="↘️ Non refundable discount"
        value={nonRefundableDiscountInput}
        onChange={setNonRefundableDiscountInput}
        suffix="%"
        ariaLabel={`Non refundable discount for ${name}`}
      />
    </div>
  )
}

export function PlatformCalculator({
  name,
  basePriceInput,
  setBasePriceInput,
  otherGuestPriceInput,
  setOtherGuestPriceInput,
  guests,
  nights,
  currency,
  tariffs,
  nonRefundableDiscountInput,
  setNonRefundableDiscountInput,
  showTitle = true,
  headerAdornment,
}: PlatformCalculatorProps) {
  const [detailView, setDetailView] = useState<{ tariffKey: string; side: 'guest' | 'host' } | null>(null)

  const guestCount = Math.max(1, guests)
  const nightCount = Math.max(1, nights)
  const isBooking = name === 'Booking'
  const normalizedNonRefundableDiscount = nonRefundableDiscountInput.replace(/,/g, '.').trim()
  const parsedNonRefundableDiscount = Number.parseFloat(normalizedNonRefundableDiscount)
  const hasNonRefundableDiscount = Number.isFinite(parsedNonRefundableDiscount) && parsedNonRefundableDiscount > 0
  const visibleTariffs = hasNonRefundableDiscount
    ? tariffs
    : tariffs.filter((tariff) => {
        const keyMatch = tariff.key.toLowerCase().includes('nonref')
        const labelMatch = tariff.label.toLowerCase().includes('non refundable')
        return !(keyMatch || labelMatch)
      })
  const activeTariff = detailView ? visibleTariffs.find((t) => t.key === detailView.tariffKey) : null
  const effectiveDetailView = detailView && activeTariff ? detailView : null
  const derivedByTariff = useDerivedAmounts({ tariffs: visibleTariffs, guestCount, nightCount, currency, isBooking })

  const renderGuestDetails = (tariff: TariffRow, derived: DerivedAmounts) => {
    return (
      <div className="detailRows">
        <BreakdownRow
          label="Base + extras"
          formula={`${derived.perNightTextBeforeDiscount} × ${nightCount}`}
          value={currency.format(derived.rawBasePlusExtrasBeforeDiscount)}
        />

        {derived.baseDiscountTotal > 0 && (
          <BreakdownRow
            label="Non refundable discount"
            formula={derived.baseDiscountFormula}
            value={`−${currency.format(derived.baseDiscountTotal)}`}
          />
        )}

        {name === 'Airbnb' && (
          <BreakdownRow
            label="Platform fees"
            formula={`${currency.format(tariff.results.host.basePlusExtras)} × ${derived.guestFeePct.toFixed(2)}%`}
            value={currency.format(derived.guestExtraOverBase)}
          />
        )}

        {isBooking && derived.geniusDiscountAmount > 0 && (
          <BreakdownRow
            label="Genius discount"
            formula={`${currency.format(derived.rawBasePlusExtras)} × ${derived.geniusDiscountPct.toFixed(2)}%`}
            value={`−${currency.format(derived.geniusDiscountAmount)}`}
          />
        )}

        <div className="divider" />

        <BreakdownRow label="Guest pays" value={currency.format(tariff.results.guest.platformPrice)} emphasis />
      </div>
    )
  }

  const renderHostDetails = (tariff: TariffRow, derived: DerivedAmounts) => {
    return (
      <div className="detailRows">
        <BreakdownRow label="Accommodation price" value={currency.format(tariff.results.host.basePlusExtras)} />

        <BreakdownRow
          label={`Host fees${name === 'Booking' ? ' + transaction' : ''}`}
          formula={`${currency.format(tariff.results.host.basePlusExtras)} × ${derived.hostFeePct.toFixed(2)}%`}
          value={`−${currency.format(tariff.results.host.hostFees)}`}
        />

        <BreakdownRow
          label="VAT on host fees"
          formula={`${currency.format(tariff.results.host.hostFees)} × ${derived.vatPct.toFixed(2)}%`}
          value={`−${currency.format(tariff.results.host.vatOnHostFees)}`}
        />

        <BreakdownRow
          label="Flat tax on rental income"
          formula={`${currency.format(tariff.results.host.basePlusExtras)} × ${derived.flatTaxPct.toFixed(2)}%`}
          value={`−${currency.format(tariff.results.host.flatTax)}`}
        />

        <div className="divider" />

        <BreakdownRow label="Host takes" value={currency.format(tariff.results.host.netIncome)} emphasis />
      </div>
    )
  }

  return (
    <div className="calculatorColumn">
      {(showTitle || headerAdornment) && (
        <div className="calculatorColumnHeader">
          {showTitle && <h3 className="subTitle">{name}</h3>}
          {headerAdornment}
        </div>
      )}
      <PriceInputs
        name={name}
        basePriceInput={basePriceInput}
        setBasePriceInput={setBasePriceInput}
        otherGuestPriceInput={otherGuestPriceInput}
        setOtherGuestPriceInput={setOtherGuestPriceInput}
        nonRefundableDiscountInput={nonRefundableDiscountInput}
        setNonRefundableDiscountInput={setNonRefundableDiscountInput}
      />

      <div className="results">
        <table className="tariffsTable">
          <thead>
            <tr>
              <th>Rate</th>
              <th>💳 Guest pays</th>
              <th>🏦 Host takes</th>
            </tr>
          </thead>
          <tbody>
            {visibleTariffs.map((tariff) => (
              <tr key={tariff.key}>
                <th>
                  <div className="tariffLabel">
                    <span>{tariff.label}</span>
                  </div>
                </th>
                <td>
                  <button type="button" className="tariffCellButton" onClick={() => setDetailView({ tariffKey: tariff.key, side: 'guest' })}>
                    {currency.format(tariff.results.guest.platformPrice)}
                  </button>
                </td>
                <td>
                  <button type="button" className="tariffCellButton" onClick={() => setDetailView({ tariffKey: tariff.key, side: 'host' })}>
                    {currency.format(tariff.results.host.netIncome)}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {effectiveDetailView && activeTariff && derivedByTariff[activeTariff.key] && (
        <div className="detailModalOverlay" role="dialog" aria-modal="true">
          <div className="detailModal">
            <div className="detailModalHeader">
              <div>
                <span className="pillLabel">{effectiveDetailView.side === 'guest' ? 'Guest pays' : 'Host takes'} breakdown</span>
                <h4 className="detailModalTitle">
                  {name} · {activeTariff.label}
                </h4>
              </div>
              <button type="button" className="detailModalClose" onClick={() => setDetailView(null)}>
                ×
              </button>
            </div>

            {effectiveDetailView.side === 'guest'
              ? renderGuestDetails(activeTariff, derivedByTariff[activeTariff.key])
              : renderHostDetails(activeTariff, derivedByTariff[activeTariff.key])}
           </div>
         </div>
       )}
     </div>
   )
 }
