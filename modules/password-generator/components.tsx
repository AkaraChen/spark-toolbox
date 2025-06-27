'use client'

import React, { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  IconButton,
  Slider,
  Stack,
  TextField,
  Tooltip,
  Typography
} from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import RefreshIcon from '@mui/icons-material/Refresh'
import { generatePassword, PasswordFlags } from './utils'
import { useNotification } from '../universal/hooks/use-notification'

/**
 * Password Generator component
 */
export function PasswordGenerator() {
  const [password, setPassword] = useState('')
  const [flags, setFlags] = useState<PasswordFlags>({
    length: 12,
    symbol: true,
    number: true,
    upperCase: true,
    lowerCase: true
  })
  const { showSuccess } = useNotification()

  // Generate password on initial render and when flags change
  useEffect(() => {
    generateNewPassword()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flags])

  const generateNewPassword = () => {
    setPassword(generatePassword(flags))
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(password)
    showSuccess('Password copied to clipboard')
  }

  const handleLengthChange = (_event: Event, value: number | number[]) => {
    setFlags(prev => ({ ...prev, length: value as number }))
  }

  const handleFlagChange = (flagName: keyof Omit<PasswordFlags, 'length'>) => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      setFlags(prev => ({ ...prev, [flagName]: event.target.checked }))
    }
  }

  return (
    <Box>
      <Card variant="outlined">
        <CardContent>
          <Stack spacing={3}>
            {/* Password display */}
            <Stack direction="row" spacing={1} alignItems="center">
              <TextField
                fullWidth
                value={password}
                InputProps={{
                  readOnly: true,
                }}
                variant="outlined"
              />
              <Tooltip title="Copy password">
                <IconButton onClick={handleCopy} color="primary">
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Generate new password">
                <IconButton onClick={generateNewPassword} color="primary">
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Stack>

            {/* Password length slider */}
            <Box>
              <Typography gutterBottom>
                Password Length: {flags.length}
              </Typography>
              <Slider
                value={flags.length}
                onChange={handleLengthChange}
                min={4}
                max={32}
                step={1}
                sx={{ maxWidth: 600 }}
                marks={[
                  { value: 4, label: '4' },
                  { value: 12, label: '12' },
                  { value: 20, label: '20' },
                  { value: 32, label: '32' }
                ]}
              />
            </Box>

            {/* Character type options */}
            <Stack direction="row" spacing={2} flexWrap="wrap">
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={flags.upperCase} 
                    onChange={handleFlagChange('upperCase')} 
                  />
                }
                label="Uppercase (A-Z)"
              />
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={flags.lowerCase} 
                    onChange={handleFlagChange('lowerCase')} 
                  />
                }
                label="Lowercase (a-z)"
              />
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={flags.number} 
                    onChange={handleFlagChange('number')} 
                  />
                }
                label="Numbers (0-9)"
              />
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={flags.symbol} 
                    onChange={handleFlagChange('symbol')} 
                  />
                }
                label="Symbols (!@#$...)"
              />
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  )
}
