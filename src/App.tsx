import { useMemo, useState } from 'react'
import './App.css'
import { computeAirbnb, computeBooking } from './calculations'
import type { PlatformParams, PlatformResults } from './calculations'
import { PlatformCalculator, type TariffRow } from './components/PlatformCalculator'
import { GuestSlider } from './components/GuestSlider'
import { ParametersPanel } from './components/ParametersPanel'
import { useNumericInput, usePersistentState } from './hooks'

type PlatformParamOverrides = Partial<Omit<PlatformParams, 'basePrice' | 'otherGuestPrice' | 'guests' | 'nights'>>

type BuildTariffsArgs = {
  basePrice: number
  otherGuestPrice: number
  guests: number
  nights: number
  compute: (params: PlatformParams) => PlatformResults
  extraParams?: PlatformParamOverrides
  nonRefundableDiscount: number
  baseBadge: string
  nonRefundableBadgeFormatter?: (discountPct: number) => string
}

function buildPlatformTariffs({
  basePrice,
  otherGuestPrice,
  guests,
  nights,
  compute,
  extraParams = {},
  nonRefundableDiscount,
  baseBadge,
  nonRefundableBadgeFormatter,
}: BuildTariffsArgs): TariffRow[] {
  const normalizedGuests = Math.max(1, guests)
  const normalizedNights = Math.max(1, nights)
  const params: PlatformParams = {
    basePrice,
    otherGuestPrice,
    guests: normalizedGuests,
    nights: normalizedNights,
    ...extraParams,
  } as PlatformParams

  const baseResults = compute(params)
  const tariffs: TariffRow[] = [
    {
      key: 'base',
      label: 'Base',
      badge: baseBadge,
      basePrice,
      otherGuestPrice,
      basePriceBeforeDiscount: basePrice,
      results: baseResults,
    },
  ]

  const discount = Math.max(0, nonRefundableDiscount)
  if (discount > 0) {
    const discountedParams: PlatformParams = {
      ...params,
      basePrice: basePrice * (1 - discount / 100),
    }
    const discountedResults = compute(discountedParams)
    tariffs.push({
      key: 'nonref',
      label: 'Non refundable',
      badge: nonRefundableBadgeFormatter?.(discount) ?? `−${discount.toFixed(0)}%`,
      basePrice: discountedParams.basePrice,
      otherGuestPrice,
      basePriceBeforeDiscount: basePrice,
      results: discountedResults,
    })
  }

  return tariffs
}

function App() {
  const airbnbGuestFeePct = useNumericInput('17,22', 'airbnbGuestFeePct')
  const airbnbHostFeePct = useNumericInput('3', 'airbnbHostFeePct')
  const bookingHostFeePct = useNumericInput('15', 'bookingHostFeePct')
  const bookingTransactionFeePct = useNumericInput('2', 'bookingTransactionFeePct')
  const vatPct = useNumericInput('22', 'vatPct')
  const flatTaxPct = useNumericInput('21', 'flatTaxPct')
  const otherGuestPrice = useNumericInput('10', 'airbnbOtherGuestPrice')
  const basePrice = useNumericInput('65', 'airbnbBasePrice')
  const bookingOtherGuestPrice = useNumericInput('10', 'bookingOtherGuestPrice')
  const bookingBasePrice = useNumericInput('65', 'bookingBasePrice')
  const airbnbNonRefundableDiscount = useNumericInput('10', 'airbnbNonRefundableDiscount')
  const bookingNonRefundableDiscount = useNumericInput('10', 'bookingNonRefundableDiscount')

  const [guestCount, setGuestCount] = usePersistentState<number>('guestCount', 2)
  const [nightsCount, setNightsCount] = usePersistentState<number>('nightsCount', 1)
  const [isParamsOpen, setIsParamsOpen] = useState(false)
  const [bookingGeniusLevel, setBookingGeniusLevel] = usePersistentState<0 | 1 | 2 | 3>('bookingGeniusLevel', 0)

  const bookingGeniusPct =
    bookingGeniusLevel === 0
      ? 0
      : bookingGeniusLevel === 1
      ? 10
      : bookingGeniusLevel === 2
      ? 15
      : 20

  const airbnbTariffs = useMemo<TariffRow[]>(() =>
    buildPlatformTariffs({
      basePrice: basePrice.value,
      otherGuestPrice: otherGuestPrice.value,
      guests: guestCount,
      nights: nightsCount,
      compute: computeAirbnb,
      extraParams: {
        guestFeePct: airbnbGuestFeePct.value,
        hostFeePct: airbnbHostFeePct.value,
        vatPct: vatPct.value,
        flatTaxPct: flatTaxPct.value,
      },
      nonRefundableDiscount: airbnbNonRefundableDiscount.value,
      baseBadge: 'Standard',
      nonRefundableBadgeFormatter: (discountPct) => `−${discountPct.toFixed(0)}%`,
    }),
  [
    airbnbGuestFeePct.value,
    airbnbHostFeePct.value,
    airbnbNonRefundableDiscount.value,
    basePrice.value,
    flatTaxPct.value,
    guestCount,
    nightsCount,
    otherGuestPrice.value,
    vatPct.value,
  ])

  const bookingTariffs = useMemo<TariffRow[]>(() =>
    buildPlatformTariffs({
      basePrice: bookingBasePrice.value,
      otherGuestPrice: bookingOtherGuestPrice.value,
      guests: guestCount,
      nights: nightsCount,
      compute: computeBooking,
      extraParams: {
        hostFeePct: bookingHostFeePct.value,
        transactionFeePct: bookingTransactionFeePct.value,
        vatPct: vatPct.value,
        flatTaxPct: flatTaxPct.value,
        geniusDiscountPct: bookingGeniusPct,
      },
      nonRefundableDiscount: bookingNonRefundableDiscount.value,
      baseBadge: bookingGeniusPct ? `Genius ${bookingGeniusLevel}` : 'Standard',
      nonRefundableBadgeFormatter: (discountPct) => `−${discountPct.toFixed(0)}%`,
    }),
  [
    bookingBasePrice.value,
    bookingGeniusLevel,
    bookingGeniusPct,
    bookingHostFeePct.value,
    bookingNonRefundableDiscount.value,
    bookingOtherGuestPrice.value,
    bookingTransactionFeePct.value,
    flatTaxPct.value,
    guestCount,
    nightsCount,
    vatPct.value,
  ])

  const currency = useMemo(
    () =>
      new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 2,
      }),
    [],
  )

  return (
    <div className="page">
      <header className="topbar">
        <div className="brand">
          <div className="mark" aria-hidden="true" />
          <div>
            <div className="title">BnB Price Calculator</div>
            <div className="subtitle">Price it right, every night.</div>
          </div>
        </div>
        <button
          type="button"
          className="paramsToggle"
          onClick={() => setIsParamsOpen(true)}
          aria-label="Open parameters panel"
        >
          ⚙️ Parameters
        </button>
      </header>

      <ParametersPanel
        isOpen={isParamsOpen}
        onClose={() => setIsParamsOpen(false)}
        vatPctInput={vatPct.raw}
        setVatPctInput={vatPct.setRaw}
        flatTaxPctInput={flatTaxPct.raw}
        setFlatTaxPctInput={flatTaxPct.setRaw}
        airbnbGuestFeePctInput={airbnbGuestFeePct.raw}
        setAirbnbGuestFeePctInput={airbnbGuestFeePct.setRaw}
        airbnbHostFeePctInput={airbnbHostFeePct.raw}
        setAirbnbHostFeePctInput={airbnbHostFeePct.setRaw}
        bookingHostFeePctInput={bookingHostFeePct.raw}
        setBookingHostFeePctInput={bookingHostFeePct.setRaw}
        bookingTransactionFeePctInput={bookingTransactionFeePct.raw}
        setBookingTransactionFeePctInput={bookingTransactionFeePct.setRaw}
      />

      <main className="layout layoutSingle">
        <section className="card calculatorCard">
          <div className="cardHeader">
            <div className="cardHeader-main">
              <h2>Calculator</h2>
              <div className="cardHeader-sub">
                <span className="pillLabel">Scenario</span>
                <span className="pillValue">
                  {guestCount} guest{guestCount === 1 ? '' : 's'} · {nightsCount} night
                  {nightsCount === 1 ? '' : 's'}
                </span>
              </div>
            </div>
          </div>

          <div className="calculatorControls">
            <div className="calculatorControls-slidersRow">
              <GuestSlider value={guestCount} onChange={setGuestCount} label="👥 Guests" />
              <GuestSlider value={nightsCount} onChange={setNightsCount} label="🌙 Nights" min={1} max={30}/>
            </div>
          </div>

          <div className="calculatorGrid">
            <div className="platformPanel airbnbPanel">
              <PlatformCalculator
                name="Airbnb"
                basePriceLabelHint="Price to enter in your Airbnb calendar."
                basePriceInput={basePrice.raw}
                setBasePriceInput={basePrice.setRaw}
                otherGuestPriceInput={otherGuestPrice.raw}
                setOtherGuestPriceInput={otherGuestPrice.setRaw}
                guests={guestCount}
                nights={nightsCount}
                currency={currency}
                tariffs={airbnbTariffs}
                nonRefundableDiscountInput={airbnbNonRefundableDiscount.raw}
                setNonRefundableDiscountInput={airbnbNonRefundableDiscount.setRaw}
              />
            </div>

            <div className="platformPanel bookingPanel">
              <PlatformCalculator
                name="Booking"
                basePriceLabelHint="Price to enter in your Booking calendar."
                basePriceInput={bookingBasePrice.raw}
                setBasePriceInput={bookingBasePrice.setRaw}
                otherGuestPriceInput={bookingOtherGuestPrice.raw}
                setOtherGuestPriceInput={bookingOtherGuestPrice.setRaw}
                guests={guestCount}
                nights={nightsCount}
                currency={currency}
                tariffs={bookingTariffs}
                nonRefundableDiscountInput={bookingNonRefundableDiscount.raw}
                setNonRefundableDiscountInput={bookingNonRefundableDiscount.setRaw}
                headerAdornment={
                  <select
                    className="bookingGeniusSelect bookingGeniusSelect-header"
                    value={bookingGeniusLevel}
                    onChange={(e) => setBookingGeniusLevel(Number(e.target.value) as 0 | 1 | 2 | 3)}
                  >
                    <option value={0}>Genius: Off</option>
                    <option value={1}>Level 1 (10%)</option>
                    <option value={2}>Level 2 (15%)</option>
                    <option value={3}>Level 3 (20%)</option>
                  </select>
                }
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <span className="muted">

        </span>
      </footer>
    </div>
  )
}

export default App
