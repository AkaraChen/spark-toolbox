'use client'

import { Box, Button, Typography } from '@mui/material'
import { VideoInfo } from '../types'
import { downloadViaProxy } from '../../universal/api-client'

interface VideoInfoDisplayProps {
    videoInfo: VideoInfo
}

/**
 * 视频信息显示组件
 */
export function VideoInfoDisplay({ videoInfo }: VideoInfoDisplayProps) {
    // 处理下载封面
    const handleDownloadCover = async () => {
        if (videoInfo?.pic) {
            try {
                await downloadViaProxy(
                    videoInfo.pic,
                    `${videoInfo.title}-封面.jpg`,
                )
            } catch (error) {
                console.error('下载封面失败:', error)
            }
        }
    }

    return (
        <Box sx={{ mb: 3 }}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    mb: 1,
                }}
            >
                <Typography variant='subtitle1' gutterBottom>
                    {videoInfo.title}
                </Typography>
                <Button
                    size='small'
                    variant='outlined'
                    onClick={handleDownloadCover}
                    sx={{ ml: 2, minWidth: '100px' }}
                >
                    下载封面
                </Button>
            </Box>
            <Typography variant='body2' color='text.secondary'>
                UP主: {videoInfo.owner.name}
            </Typography>
        </Box>
    )
}
