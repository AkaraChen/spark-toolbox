'use client'

import { Box, LinearProgress, Typography } from '@mui/material'

interface DownloadProgressProps {
    progress: number
    visible: boolean
}

/**
 * 下载进度组件
 */
export function DownloadProgress({ progress, visible }: DownloadProgressProps) {
    if (!visible) return null
    
    return (
        <Box sx={{ width: '100%', mb: 1 }}>
            <LinearProgress
                variant='determinate'
                value={progress}
            />
            <Typography
                variant='body2'
                color='text.secondary'
                align='center'
                sx={{ mt: 0.5 }}
            >
                {Math.round(progress)}%
            </Typography>
        </Box>
    )
}
