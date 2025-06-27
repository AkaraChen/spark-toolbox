import * as React from 'react'
import { useState } from 'react'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { useStore } from '@/modules/universal/store'
import { useNotification } from '@/modules/universal/components/notification-provider'

export function AISettings() {
    const {
        openaiBase,
        openaiKey,
        largeModel,
        baseModel,
        smallModel,
        setOpenaiBase,
        setOpenaiKey,
        setLargeModel,
        setBaseModel,
        setSmallModel,
        resetSettings,
    } = useStore()

    const { showNotification } = useNotification()
    const [showApiKey, setShowApiKey] = useState(false)

    const handleOpenAIBaseChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setOpenaiBase(event.target.value)
    }

    const handleOpenAIKeyChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setOpenaiKey(event.target.value)
    }

    const handleLargeModelChange = (
        event: React.ChangeEvent<{ value: unknown }>,
    ) => {
        setLargeModel(event.target.value as string)
    }

    const handleBaseModelChange = (
        event: React.ChangeEvent<{ value: unknown }>,
    ) => {
        setBaseModel(event.target.value as string)
    }

    const handleSmallModelChange = (
        event: React.ChangeEvent<{ value: unknown }>,
    ) => {
        setSmallModel(event.target.value as string)
    }

    const handleResetSettings = () => {
        resetSettings()
        showNotification('AI 设置已重置', 'info')
    }

    const toggleShowApiKey = () => {
        setShowApiKey(!showApiKey)
    }

    return (
        <Stack spacing={3} sx={{ py: 3 }}>
            <TextField
                label='OpenAI Base URL'
                fullWidth
                value={openaiBase}
                onChange={handleOpenAIBaseChange}
                placeholder='https://api.openai.com/v1'
                helperText='OpenAI API 的基础 URL'
            />

            <TextField
                label='OpenAI API Key'
                fullWidth
                type={showApiKey ? 'text' : 'password'}
                value={openaiKey}
                onChange={handleOpenAIKeyChange}
                placeholder='sk-...'
                helperText='您的 OpenAI API 密钥'
                slotProps={{
                    input: {
                        endAdornment: (
                            <InputAdornment position='end'>
                                <IconButton
                                    aria-label='toggle password visibility'
                                    onClick={toggleShowApiKey}
                                    edge='end'
                                >
                                    {showApiKey ? (
                                        <VisibilityOff />
                                    ) : (
                                        <Visibility />
                                    )}
                                </IconButton>
                            </InputAdornment>
                        ),
                    },
                }}
            />

            <FormControl fullWidth>
                <InputLabel id='large-model-label'>大型模型</InputLabel>
                <Select
                    labelId='large-model-label'
                    value={largeModel}
                    label='大型模型'
                    onChange={handleLargeModelChange as any}
                >
                    <MenuItem value='gpt-4.1'>GPT-4.1</MenuItem>
                    <MenuItem value='gpt-4-turbo'>GPT-4 Turbo</MenuItem>
                    <MenuItem value='gpt-4o'>GPT-4o</MenuItem>
                </Select>
            </FormControl>

            <FormControl fullWidth>
                <InputLabel id='base-model-label'>基础模型</InputLabel>
                <Select
                    labelId='base-model-label'
                    value={baseModel}
                    label='基础模型'
                    onChange={handleBaseModelChange as any}
                >
                    <MenuItem value='gpt-4.1-mini'>GPT-4.1 Mini</MenuItem>
                    <MenuItem value='gpt-3.5-turbo'>GPT-3.5 Turbo</MenuItem>
                    <MenuItem value='gpt-3.5-turbo-16k'>
                        GPT-3.5 Turbo 16K
                    </MenuItem>
                </Select>
            </FormControl>

            <FormControl fullWidth>
                <InputLabel id='small-model-label'>小型模型</InputLabel>
                <Select
                    labelId='small-model-label'
                    value={smallModel}
                    label='小型模型'
                    onChange={handleSmallModelChange as any}
                >
                    <MenuItem value='gpt-4.1-nano'>GPT-4.1 Nano</MenuItem>
                    <MenuItem value='gpt-3.5-turbo-instruct'>
                        GPT-3.5 Turbo Instruct
                    </MenuItem>
                    <MenuItem value='davinci-002'>Davinci-002</MenuItem>
                </Select>
            </FormControl>

            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    variant='contained'
                    color='primary'
                    onClick={handleResetSettings}
                >
                    重置设置
                </Button>
            </Box>
        </Stack>
    )
}
