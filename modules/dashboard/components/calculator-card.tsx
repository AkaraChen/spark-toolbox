'use client'

import * as React from 'react'
import { useState } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Evaluate from 'math-expression-evaluator'

const evaluator = new Evaluate()

export function CalculatorCard() {
    const [expression, setExpression] = useState('')
    const [result, setResult] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newExpression = event.target.value
        setExpression(newExpression)

        if (newExpression.trim() === '') {
            setResult(null)
            setError(null)
            return
        }

        try {
            const evalResult = evaluator.eval(newExpression)
            setResult(String(evalResult))
            setError(null)
        } catch (e: any) {
            setResult(null)
            setError(e.message || 'Invalid expression')
        }
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Calculator
                </Typography>
                <TextField
                    fullWidth
                    variant="outlined"
                    label="Enter expression"
                    value={expression}
                    onChange={handleChange}
                    error={!!error}
                    helperText={error}
                />
                <Box sx={{ mt: 2, p: 2, backgroundColor: 'grey.100', borderRadius: 1, minHeight: '50px' }}>
                    <Typography variant="h5" component="div" sx={{ wordWrap: 'break-word' }}>
                        {result}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    )
}
