'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Skeleton from '@mui/material/Skeleton'
import { getCurrencyRates } from '../api/client'

const currencies = [
    { code: 'CNY', name: 'Chinese Yuan', flag: '🇨🇳' },
    { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
    { code: 'HKD', name: 'Hong Kong Dollar', flag: '🇭🇰' },
    { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
    { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵' },
]

type CurrencyCode = 'CNY' | 'USD' | 'HKD' | 'EUR' | 'JPY';

export function CurrencyExchangeCard() {
    const { data: rates, isLoading, error } = useQuery({
        queryKey: ['currencyRates'],
        queryFn: getCurrencyRates,
        staleTime: 1000 * 60 * 60, // 1 hour
    })

    const [values, setValues] = useState<Record<CurrencyCode, string>>({
        CNY: '100.00',
        USD: '',
        HKD: '',
        EUR: '',
        JPY: '',
    })

    useEffect(() => {
        if (rates) {
            const cnyValue = parseFloat(values.CNY)
            if (!isNaN(cnyValue)) {
                setValues(prev => ({
                    ...prev,
                    USD: (cnyValue * rates.cny.usd).toFixed(2),
                    HKD: (cnyValue * rates.cny.hkd).toFixed(2),
                    EUR: (cnyValue * rates.cny.eur).toFixed(2),
                    JPY: (cnyValue * rates.cny.jpy).toFixed(2),
                }))
            }
        }
    }, [rates])

    const handleValueChange = (code: CurrencyCode, value: string) => {
        if (!rates) return

        const numericValue = parseFloat(value)
        if (isNaN(numericValue)) {
            setValues(prev => ({ ...prev, [code]: '' }))
            return
        }

        let baseCnyValue: number;
        if (code === 'CNY') {
            baseCnyValue = numericValue
        } else {
            const rate = rates.cny[code.toLowerCase() as keyof typeof rates.cny]
            baseCnyValue = numericValue / rate
        }

        setValues({
            CNY: baseCnyValue.toFixed(2),
            USD: (baseCnyValue * rates.cny.usd).toFixed(2),
            HKD: (baseCnyValue * rates.cny.hkd).toFixed(2),
            EUR: (baseCnyValue * rates.cny.eur).toFixed(2),
            JPY: (baseCnyValue * rates.cny.jpy).toFixed(2),
        })
    }

    if (isLoading) {
        return <Skeleton variant="rectangular" height={280} />
    }

    if (error) {
        return (
            <Card>
                <CardContent>
                    <Typography color="error">Failed to load currency rates.</Typography>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Currency Exchange
                </Typography>
                <Box component="form" noValidate autoComplete="off">
                    {currencies.map(({ code, flag }) => (
                        <Box key={code} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Typography sx={{ fontSize: '1.5rem', mr: 1.5 }}>{flag}</Typography>
                            <TextField
                                fullWidth
                                type="number"
                                value={values[code as CurrencyCode]}
                                onChange={(e) => handleValueChange(code as CurrencyCode, e.target.value)}
                                sx={{ mr: 1.5 }}
                            />
                            <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                                {code}
                            </Typography>
                        </Box>
                    ))}
                </Box>
                <Typography variant="caption" color="text.secondary">
                    Last updated: {rates && new Date(rates.date).toLocaleDateString()}
                </Typography>
            </CardContent>
        </Card>
    )
}
