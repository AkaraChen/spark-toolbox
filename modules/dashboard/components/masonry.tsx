import * as React from 'react'
import { Masonry } from '@mui/lab'
import { RealTimeClock } from '@/modules/dashboard/components/real-time-clock'
import { BingImageCard } from '@/modules/dashboard/components/bing-image-card'

export function DashboardMasonry() {
    return (
        <Masonry columns={{ xs: 1, sm: 2, md: 4 }} spacing={3}>
            <RealTimeClock />
            <BingImageCard />
            {/* You can add more cards here in the future */}
        </Masonry>
    )
}
