import * as React from 'react'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Alert from '@mui/material/Alert'
import Divider from '@mui/material/Divider'
import { useAppStore } from '@/modules/universal/store'
import { useNotification } from '@/modules/universal/components/notification-provider'

export function SystemSettings() {
    const { resetAllSettings, resetAISettings } = useAppStore()
    const { showNotification } = useNotification()

    const handleResetAllSettings = () => {
        resetAllSettings()
        showNotification('所有设置已重置', 'warning')
    }

    const handleResetAISettings = () => {
        resetAISettings()
        showNotification('AI 设置已重置', 'info')
    }

    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant='h6' gutterBottom>
                系统设置
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Stack spacing={2}>
                <Alert severity='info'>
                    系统设置将在此处显示。请根据需要添加所需的设置项。
                </Alert>
                <Box
                    sx={{
                        mt: 1,
                        display: 'flex',
                        justifyContent: 'space-between',
                    }}
                >
                    <Button variant='outlined' onClick={handleResetAISettings}>
                        重置 AI 设置
                    </Button>

                    <Button
                        variant='outlined'
                        color='error'
                        onClick={handleResetAllSettings}
                    >
                        重置所有设置
                    </Button>
                </Box>
            </Stack>
        </Paper>
    )
}
