import { z } from 'zod'

// Schema for the Bing Wallpaper API response
const BingImageSchema = z.object({
    url: z.string(),
    copyright: z.string(),
    copyright_link: z.string(),
})

const CurrencyRatesSchema = z.object({
    date: z.string(),
    cny: z.object({
        usd: z.number(),
        hkd: z.number(),
        eur: z.number(),
        jpy: z.number(),
    }),
})

export type CurrencyRates = z.infer<typeof CurrencyRatesSchema>

export async function getCurrencyRates(): Promise<CurrencyRates> {
    const response = await fetch('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/cny.json')
    if (!response.ok) {
        throw new Error('Failed to fetch currency rates')
    }
    const data = await response.json()
    return CurrencyRatesSchema.parse(data)
}

export async function getBingImage() {
    const response = await fetch(
        'https://bing.biturl.top/?resolution=UHD&format=json&index=random&mkt=en-US',
    )
    if (!response.ok) {
        throw new Error('Failed to fetch Bing image')
    }
    const data = await response.json()
    return BingImageSchema.parse(data)
}
