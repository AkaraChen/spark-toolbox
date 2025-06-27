import { z } from 'zod'

// Schema for the Bing Wallpaper API response
const BingImageSchema = z.object({
    url: z.string(),
    copyright: z.string(),
})

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
