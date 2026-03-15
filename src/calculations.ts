/**
 * Shared input parameters for platform price computations.
 * Monetary fields are expressed in EUR; percentage fields are plain numbers (e.g. 3 => 3%).
 */
export type PlatformParams = {
  basePrice: number
  otherGuestPrice: number
  guests: number
  nights: number
  guestFeePct?: number
  hostFeePct: number
  transactionFeePct?: number
  vatPct: number
  flatTaxPct: number
  /** Optional Booking Genius discount applied to (base price + extras) before fees. */
  geniusDiscountPct?: number
}

function computeBasePlusExtras({ basePrice, otherGuestPrice, guests, nights }: Pick<PlatformParams, 'basePrice' | 'otherGuestPrice' | 'guests' | 'nights'>) {
  const safeGuests = Math.max(1, guests)
  const safeNights = Math.max(1, nights)
  const perNight = basePrice + Math.max(0, safeGuests - 1) * otherGuestPrice
  return perNight * safeNights
}

function applyGuestFee(baseAmount: number, guestFeePct = 0) {
  return baseAmount * (1 + guestFeePct / 100)
}

function applyDiscount(baseAmount: number, discountPct = 0) {
  return baseAmount * (1 - discountPct / 100)
}

function computeHostFinancials(baseAmount: number, hostFeePct: number, vatPct: number, flatTaxPct: number) {
  const hostFees = baseAmount * (hostFeePct / 100)
  const vatOnHostFees = hostFees * (vatPct / 100)
  const flatTax = baseAmount * (flatTaxPct / 100)
  const netIncome = baseAmount - hostFees - vatOnHostFees - flatTax
  return { hostFees, vatOnHostFees, flatTax, netIncome }
}

export type GuestViewResult = {
  platformPrice: number
}

export type HostViewResult = {
  basePlusExtras: number
  hostFees: number
  vatOnHostFees: number
  flatTax: number
  netIncome: number
}

export type PlatformResults = {
  guest: GuestViewResult
  host: HostViewResult
}

/**
 * Computes Airbnb guest/platform prices and host-side fees from the provided parameters.
 */
export function computeAirbnb(params: PlatformParams): PlatformResults {
  const basePlusExtras = computeBasePlusExtras(params)
  const platformPrice = applyGuestFee(basePlusExtras, params.guestFeePct ?? 0)
  const hostFinancials = computeHostFinancials(basePlusExtras, params.hostFeePct, params.vatPct, params.flatTaxPct)

  return {
    guest: { platformPrice },
    host: { basePlusExtras, ...hostFinancials },
  }
}

/**
 * Computes Booking guest/platform prices and host-side fees, including Genius savings.
 */
export function computeBooking(params: PlatformParams): PlatformResults {
  const basePlusExtras = computeBasePlusExtras(params)
  const discountedBasePlusExtras = applyDiscount(basePlusExtras, params.geniusDiscountPct ?? 0)
  const platformPrice = discountedBasePlusExtras
  const hostTotalPct = params.hostFeePct + (params.transactionFeePct ?? 0)
  const hostFinancials = computeHostFinancials(
    discountedBasePlusExtras,
    hostTotalPct,
    params.vatPct,
    params.flatTaxPct,
  )

  return {
    guest: { platformPrice },
    host: { basePlusExtras: discountedBasePlusExtras, ...hostFinancials },
  }
}
