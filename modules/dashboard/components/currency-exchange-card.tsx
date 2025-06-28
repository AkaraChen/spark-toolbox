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
import { CircularProgress } from '@mui/material'

const currencies: Array<{ code: CurrencyCode; name: string; flag: string }> = [
    { code: 'CNY', name: 'Chinese Yuan', flag: '🇨🇳' },
    { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
    { code: 'HKD', name: 'Hong Kong Dollar', flag: '🇭🇰' },
    { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
    { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵' },
]

type CurrencyCode = 'CNY' | 'USD' | 'HKD' | 'EUR' | 'JPY'

export function CurrencyExchangeCard() {
    const {
        data: rates,
        isLoading,
        error,
    } = useQuery({
        queryKey: ['currencyRates'],
        queryFn: getCurrencyRates,
        staleTime: 1000 * 60 * 60, // 1 hour
    })

    const [base, setBase] = useState<{ code: CurrencyCode; amount: number }>({
        code: 'CNY',
        amount: 100,
    })
    const [displayValues, setDisplayValues] = useState<
        Record<CurrencyCode, string>
    >({
        CNY: '100',
        USD: '',
        HKD: '',
        EUR: '',
        JPY: '',
    })

    useEffect(() => {
        if (!rates) return

        let baseCnyAmount: number
        if (base.code === 'CNY') {
            baseCnyAmount = base.amount
        } else {
            const rate =
                rates.cny[base.code.toLowerCase() as keyof typeof rates.cny]
            baseCnyAmount = base.amount / rate
        }

        const newDisplayValues: Record<CurrencyCode, string> = {
            CNY: baseCnyAmount.toFixed(2),
            USD: (baseCnyAmount * rates.cny.usd).toFixed(2),
            HKD: (baseCnyAmount * rates.cny.hkd).toFixed(2),
            EUR: (baseCnyAmount * rates.cny.eur).toFixed(2),
            JPY: (baseCnyAmount * rates.cny.jpy).toFixed(2),
        }

        setDisplayValues(newDisplayValues)
    }, [rates, base])

    const handleInputChange = (code: CurrencyCode, value: string) => {
        setDisplayValues(prev => ({
            ...prev,
            [code]: value,
        }))
    }

    const handleCommit = (code: CurrencyCode) => {
        const amount = parseFloat(displayValues[code])
        if (!isNaN(amount)) {
            setBase({ code, amount })
        } else {
            // Revert to the last valid state by re-triggering the effect
            setBase(prev => ({ ...prev }))
        }
    }

    const handleKeyDown = (
        event: React.KeyboardEvent,
        code: CurrencyCode,
    ) => {
        if (event.key === 'Enter') {
            handleCommit(code)
            const input = event.target as HTMLInputElement
            input.blur()
        }
    }

    if (isLoading) {
        return <Skeleton variant='rectangular' height={280} />
    }

    if (error) {
        return (
            <Card>
                <CardContent>
                    <Typography color='error'>
                        Failed to load currency rates.
                    </Typography>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardContent>
                <Typography variant='h6' gutterBottom>
                    Currency Exchange
                </Typography>
                <Box component='form' noValidate autoComplete='off'>
                    {currencies.map(({ code, flag }) => (
                        <Box
                            key={code}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                mb: 2,
                            }}
                        >
                            <Typography sx={{ fontSize: '1.5rem', mr: 1.5 }}>
                                {flag}
                            </Typography>
                            <TextField
                                fullWidth
                                type='number'
                                value={displayValues[code] || ''}
                                onChange={e =>
                                    handleInputChange(code, e.target.value)
                                }
                                onBlur={() => handleCommit(code)}
                                onKeyDown={e => handleKeyDown(e, code)}
                                sx={{ mr: 1.5 }}
                                size='small'
                            />
                            <Typography
                                variant='body1'
                                sx={{ fontFamily: 'monospace' }}
                            >
                                {code}
                            </Typography>
                        </Box>
                    ))}
                </Box>
                <Typography variant='caption' color='text.secondary'>
                    Last updated:{' '}
                    {rates ? (
                        new Date(rates.date).toLocaleDateString()
                    ) : (
                        <CircularProgress size={16} />
                    )}
                </Typography>
            </CardContent>
        </Card>
    )
}
