'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

export function RealTimeClock() {
    const [time, setTime] = useState(new Date())

    useEffect(() => {
        const timerId = setInterval(() => {
            setTime(new Date())
        }, 1000)

        return () => {
            clearInterval(timerId)
        }
    }, [])

    return (
        <Card>
            <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant='h4' component='div'>
                    {time.toLocaleTimeString('en-US', { hour12: false })}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
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
