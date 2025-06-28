'use client'

import * as React from 'react'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Evaluate from 'math-expression-evaluator'

const evaluator = new Evaluate()

export function CalculatorCard() {
    const [expression, setExpression] = useState('')

    const { data: result, error } = useQuery<string, Error>({
        // The query key includes the expression, so the query re-runs when it changes
        queryKey: ['calculator', expression],
        // The query function wraps the synchronous evaluation
        queryFn: async () => {
            // We use a promise because useQuery expects an async function
            return new Promise((resolve, reject) => {
                try {
                    const evalResult = evaluator.eval(expression)
                    resolve(String(evalResult))
                } catch (e: any) {
                    reject(new Error(e.message || 'Invalid expression'))
                }
            })
        },
        // Only enable the query if the expression is not empty
        enabled: expression.trim() !== '',
        // We don't want retries for a synchronous calculation
        retry: false,
        // Don't refetch on window focus for this kind of calculation
        refetchOnWindowFocus: false,
    })

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setExpression(event.target.value)
    }

    const errorMessage = error instanceof Error ? error.message : null

    return (
        <Card>
            <CardContent>
                <Typography variant='h6' gutterBottom>
                    Calculator
                </Typography>
                <TextField
                    fullWidth
                    variant='outlined'
                    label='Enter expression'
                    value={expression}
                    onChange={handleChange}
                    error={!!errorMessage}
                    helperText={errorMessage}
                />
                <Box
                    sx={{
                        mt: 2,
                        p: 2,
                        backgroundColor: 'grey.100',
                        borderRadius: 1,
                        minHeight: '50px',
                    }}
                >
                    <Typography
                        variant='h5'
                        component='div'
                        sx={{ wordWrap: 'break-word' }}
                    >
                        {result}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    )
}
