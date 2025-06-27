import * as React from 'react'
import { useState } from 'react'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { useAppStore } from '@/store'
import { useNotification } from '@/modules/universal/notification-provider'

export function AISettings() {
    const { ai, updateAISettings, resetAISettings } = useAppStore()
    const { showNotification } = useNotification()
    const [showApiKey, setShowApiKey] = useState(false)
    
    const handleOpenAIBaseChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        updateAISettings({ openaiBase: event.target.value })
    }
    
    const handleOpenAIKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        updateAISettings({ openaiKey: event.target.value })
    }
    
    const handleLargeModelChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        updateAISettings({ largeModel: event.target.value as string })
    }
    
    const handleBaseModelChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        updateAISettings({ baseModel: event.target.value as string })
    }
    
    const handleSmallModelChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        updateAISettings({ smallModel: event.target.value as string })
    }
    
    const handleResetAISettings = () => {
        resetAISettings()
        showNotification('AI 设置已重置', 'info')
    }
    
    const handleSaveSettings = () => {
        showNotification('AI 设置已保存', 'success')
    }
    
    const toggleShowApiKey = () => {
        setShowApiKey(!showApiKey)
    }
    
    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant='h6' gutterBottom>
                AI 设置
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Stack spacing={3}>
                <TextField
                    label="OpenAI Base URL"
                    fullWidth
                    value={ai.openaiBase}
                    onChange={handleOpenAIBaseChange}
                    placeholder="https://api.openai.com/v1"
                    helperText="OpenAI API 的基础 URL"
                />
                
                <TextField
                    label="OpenAI API Key"
                    fullWidth
                    type={showApiKey ? 'text' : 'password'}
                    value={ai.openaiKey}
                    onChange={handleOpenAIKeyChange}
                    placeholder="sk-..."
                    helperText="您的 OpenAI API 密钥"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={toggleShowApiKey}
                                    edge="end"
                                >
                                    {showApiKey ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                />
                
                <FormControl fullWidth>
                    <InputLabel id="large-model-label">大型模型</InputLabel>
                    <Select
                        labelId="large-model-label"
                        value={ai.largeModel}
                        label="大型模型"
                        onChange={handleLargeModelChange as any}
                    >
                        <MenuItem value="gpt-4">GPT-4</MenuItem>
                        <MenuItem value="gpt-4-turbo">GPT-4 Turbo</MenuItem>
                        <MenuItem value="gpt-4o">GPT-4o</MenuItem>
                    </Select>
                </FormControl>
                
                <FormControl fullWidth>
                    <InputLabel id="base-model-label">基础模型</InputLabel>
                    <Select
                        labelId="base-model-label"
                        value={ai.baseModel}
                        label="基础模型"
                        onChange={handleBaseModelChange as any}
                    >
                        <MenuItem value="gpt-3.5-turbo">GPT-3.5 Turbo</MenuItem>
                        <MenuItem value="gpt-3.5-turbo-16k">GPT-3.5 Turbo 16K</MenuItem>
                        <MenuItem value="gpt-3.5-turbo-1106">GPT-3.5 Turbo 1106</MenuItem>
                    </Select>
                </FormControl>
                
                <FormControl fullWidth>
                    <InputLabel id="small-model-label">小型模型</InputLabel>
                    <Select
                        labelId="small-model-label"
                        value={ai.smallModel}
                        label="小型模型"
                        onChange={handleSmallModelChange as any}
                    >
                        <MenuItem value="gpt-3.5-turbo-instruct">GPT-3.5 Turbo Instruct</MenuItem>
                        <MenuItem value="babbage-002">Babbage-002</MenuItem>
                        <MenuItem value="davinci-002">Davinci-002</MenuItem>
                    </Select>
                </FormControl>
                
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                    <Button 
                        variant='outlined'
                        color='error'
                        onClick={handleResetAISettings}
                    >
                        重置 AI 设置
                    </Button>
                    
                    <Button 
                        variant='contained' 
                        color='primary'
                        onClick={handleSaveSettings}
                    >
                        保存设置
                    </Button>
                </Box>
            </Stack>
        </Paper>
    )
}
