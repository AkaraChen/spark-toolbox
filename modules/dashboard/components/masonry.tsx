import * as React from 'react'
import { Masonry } from '@mui/lab'
import { RealTimeClock } from '@/modules/dashboard/components/real-time-clock'

import { CalculatorCard } from './calculator-card'
import { CurrencyExchangeCard } from './currency-exchange-card'

export function DashboardMasonry() {
    return (
        <Masonry columns={{ xs: 1, md: 2, lg: 3 }} spacing={3}>
            <RealTimeClock />

            <CalculatorCard />
            <CurrencyExchangeCard />
        </Masonry>
    )
}
