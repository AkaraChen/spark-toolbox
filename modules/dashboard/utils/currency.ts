import { CurrencyRates } from '../api/client'

export type CurrencyCode = 'CNY' | 'USD' | 'HKD' | 'EUR' | 'JPY'

/**
 * Calculates all currency values based on a single changed currency value.
 *
 * @param code The code of the currency that was changed.
 * @param value The new numeric value of the changed currency.
 * @param rates The currency exchange rates against CNY.
 * @returns A record containing the calculated values for all currencies, rounded to 2 decimal places.
 */
export function calculateCurrencyValues(
    code: CurrencyCode,
    value: number,
    rates: CurrencyRates,
): Record<CurrencyCode, number> {
    let baseCnyValue: number
    if (code === 'CNY') {
        baseCnyValue = value
    } else {
        const rate =
            rates.cny[code.toLowerCase() as keyof typeof rates.cny]
        baseCnyValue = value / rate
    }

    const format = (val: number) => parseFloat(val.toFixed(2))

    return {
        CNY: format(baseCnyValue),
        USD: format(baseCnyValue * rates.cny.usd),
        HKD: format(baseCnyValue * rates.cny.hkd),
        EUR: format(baseCnyValue * rates.cny.eur),
        JPY: format(baseCnyValue * rates.cny.jpy),
    }
}
