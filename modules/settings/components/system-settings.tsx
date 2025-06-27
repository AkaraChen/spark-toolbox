import * as React from 'react'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Alert from '@mui/material/Alert'
import Divider from '@mui/material/Divider'
import { useAppStore } from '@/store'

export function SystemSettings() {
    const { resetSettings } = useAppStore()
    
    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant='h6' gutterBottom>
                系统设置
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Stack spacing={2}>
                <Alert severity='info'>
                    系统设置将在此处显示。您可以在后续添加所需的设置项。
                </Alert>
                <Box sx={{ mt: 1 }}>
                    <Button 
                        variant='outlined' 
                        color='error'
                        onClick={resetSettings}
                    >
                        重置所有设置
                    </Button>
                </Box>
            </Stack>
        </Paper>
    )
}
