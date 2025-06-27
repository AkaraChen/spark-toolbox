'use client'

import { Box, Paper, Typography } from '@mui/material'

interface VideoPlayerProps {
    videoUrl: string | null
}

/**
 * Bilibili视频播放器组件
 */
export function BilibiliVideoPlayer({ videoUrl }: VideoPlayerProps) {
    return (
        <Paper 
            sx={{ 
                p: 3, 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: videoUrl ? 'flex-start' : 'center',
                alignItems: videoUrl ? 'flex-start' : 'center',
                minHeight: 500
            }}
        >
            {videoUrl ? (
                <Box sx={{ width: '100%', mt: 2 }}>
                    <video 
                        controls 
                        style={{ width: '100%', maxHeight: '70vh' }}
                        src={videoUrl}
                    />
                </Box>
            ) : (
                <Typography color="text.secondary">
                    请在左侧输入BV号并获取视频链接
                </Typography>
            )}
        </Paper>
    )
}
