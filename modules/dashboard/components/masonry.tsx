import * as React from 'react'
import { Masonry } from '@mui/lab'
import { RealTimeClock } from '@/modules/dashboard/components/real-time-clock'
import { BingImageCard } from '@/modules/dashboard/components/bing-image-card'
import { CalculatorCard } from './calculator-card'

export function DashboardMasonry() {
    return (
        <Masonry columns={{ xs: 1, md: 2, lg: 3 }} spacing={3}>
            <RealTimeClock />
            <BingImageCard />
            <CalculatorCard />
            {/* You can add more cards here in the future */}
        </Masonry>
    )
}
