import * as React from 'react'
import { useState } from 'react'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { useStore } from '@/modules/universal/store'
import { useNotification } from '@/modules/universal/components/notification-provider'
import { useModels } from '@/modules/ai/hooks'

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
        openai,
    } = useStore()

    const { showNotification } = useNotification()
    const [showApiKey, setShowApiKey] = useState(false)

    // 检查 API 设置是否有效
    const isApiConfigValid = Boolean(openaiBase && openaiKey)

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

    const handleLargeModelChange = (event: SelectChangeEvent) => {
        setLargeModel(event.target.value)
    }

    const handleBaseModelChange = (event: SelectChangeEvent) => {
        setBaseModel(event.target.value)
    }

    const handleSmallModelChange = (event: SelectChangeEvent) => {
        setSmallModel(event.target.value)
    }

    const handleResetSettings = () => {
        resetSettings()
        showNotification('AI 设置已重置', 'info')
    }

    const toggleShowApiKey = () => {
        setShowApiKey(!showApiKey)
    }

    const { data: models } = useModels()

    return (
        <Stack spacing={3} sx={{ py: 3 }}>
            <TextField
                label='OpenAI Base URL'
                value={openaiBase}
                onChange={handleOpenAIBaseChange}
                fullWidth
                margin='normal'
                required
            />
            <TextField
                label='OpenAI API Key'
                fullWidth
                type={showApiKey ? 'text' : 'password'}
                value={openaiKey}
                onChange={handleOpenAIKeyChange}
                placeholder='sk-...'
                helperText='您的 OpenAI API 密钥'
                required
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

            <FormControl fullWidth disabled={!isApiConfigValid}>
                <InputLabel id='large-model-label'>大型模型</InputLabel>
                <Select
                    labelId='large-model-label'
                    value={largeModel}
                    label='大型模型'
                    onChange={handleLargeModelChange}
                >
                    {models?.map(model => (
                        <MenuItem key={model.id} value={model.id}>
                            {model.id}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl fullWidth disabled={!isApiConfigValid}>
                <InputLabel id='base-model-label'>基础模型</InputLabel>
                <Select
                    labelId='base-model-label'
                    value={baseModel}
                    label='基础模型'
                    onChange={handleBaseModelChange}
                >
                    {models?.map(model => (
                        <MenuItem key={model.id} value={model.id}>
                            {model.id}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl fullWidth disabled={!isApiConfigValid}>
                <InputLabel id='small-model-label'>小型模型</InputLabel>
                <Select
                    labelId='small-model-label'
                    value={smallModel}
                    label='小型模型'
                    onChange={handleSmallModelChange}
                >
                    {models?.map(model => (
                        <MenuItem key={model.id} value={model.id}>
                            {model.id}
                        </MenuItem>
                    ))}
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
