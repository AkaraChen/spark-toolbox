'use client'

import * as React from 'react'
import { useState } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Clock from 'react-clock'
import { useSetInterval } from '@/modules/universal/hooks/use-set-interval'
import 'react-clock/dist/Clock.css'

export function RealTimeClock() {
    const [time, setTime] = useState(new Date())

    useSetInterval(() => {
        setTime(new Date())
    }, 1000)

    return (
        <Card>
            <CardContent sx={{ textAlign: 'center' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    <Clock value={time} size={150} />
                </Box>
                <Typography variant="h4" component="div">
                    {time.toLocaleTimeString('en-US', { hour12: false })}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {time.toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    })}
                </Typography>
            </CardContent>
        </Card>
    )
}
