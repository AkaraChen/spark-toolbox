'use client'

import { Box, Typography } from '@mui/material'
import { VideoInfo } from '../type'

interface VideoInfoDisplayProps {
    videoInfo: VideoInfo
}

/**
 * 视频信息显示组件
 */
export function VideoInfoDisplay({ videoInfo }: VideoInfoDisplayProps) {
    return (
        <Box sx={{ mb: 3 }}>
            <Typography variant='subtitle1' gutterBottom>
                {videoInfo.title}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
                UP主: {videoInfo.owner.name}
            </Typography>
        </Box>
    )
}
