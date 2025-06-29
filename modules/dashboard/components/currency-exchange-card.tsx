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
import { calculateCurrencyValues, CurrencyCode } from '../utils/currency'
import { CircularProgress } from '@mui/material'

const currencies: Array<{ code: CurrencyCode; name: string; flag: string }> = [
    { code: 'CNY', name: 'Chinese Yuan', flag: '🇨🇳' },
    { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
    { code: 'HKD', name: 'Hong Kong Dollar', flag: '🇭🇰' },
    { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
    { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵' },
]



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

    const [values, setValues] = useState<Record<CurrencyCode, string>>({
        CNY: '100',
        USD: '',
        HKD: '',
        EUR: '',
        JPY: '',
    })

    const handleValueChange = React.useCallback(
        (code: CurrencyCode, value: string) => {
            if (!rates) {
                setValues(prev => ({ ...prev, [code]: value }))
                return
            }

            const numericValue = parseFloat(value)
            if (isNaN(numericValue)) {
                setValues(prev => ({ ...prev, [code]: value }))
                return
            }

            const calculatedValues = calculateCurrencyValues(
                code,
                numericValue,
                rates,
            )

            const newValues = Object.entries(calculatedValues).reduce(
                (acc, [key, val]) => {
                    acc[key as CurrencyCode] = String(val)
                    return acc
                },
                {} as Record<CurrencyCode, string>,
            )

            setValues(newValues)
        },
        [rates],
    )

    useEffect(() => {
        if (rates) {
            handleValueChange('CNY', '100')
        }
    }, [rates, handleValueChange])

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
                                value={values[code]}
                                onChange={e =>
                                    handleValueChange(code, e.target.value)
                                }
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
