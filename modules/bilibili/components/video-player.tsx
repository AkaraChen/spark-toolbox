'use client'

import { useMemo, useRef, useEffect } from 'react'
import { Box, Typography } from '@mui/material'

interface VideoPlayerProps {
    videoData: Uint8Array | null
    mimeType?: string
}

/**
 * Bilibili视频播放器组件
 */
export function BilibiliVideoPlayer({
    videoData,
    mimeType = 'video/mp4',
}: VideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null)

    // 使用useMemo创建Blob URL
    const videoUrl = useMemo(() => {
        if (!videoData) return null

        // 创建Blob对象和URL
        const blob = new Blob([videoData], { type: mimeType })
        return URL.createObjectURL(blob)
    }, [videoData, mimeType])

    // 当URL变化时设置视频源
    useEffect(() => {
        if (videoUrl && videoRef.current) {
            videoRef.current.src = videoUrl
        }
    }, [videoUrl])

    // 清理URL资源
    useEffect(() => {
        return () => {
            if (videoUrl) {
                URL.revokeObjectURL(videoUrl)
            }
        }
    }, [videoUrl])

    return (
        <Box>
            {videoData ? (
                <Box sx={{ width: '100%' }}>
                    <video
                        ref={videoRef}
                        controls
                        style={{ width: '100%', maxHeight: '70vh' }}
                    />
                </Box>
            ) : (
                <Typography
                    color='text.secondary'
                    style={{
                        height: '100px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    请在左侧输入BV号并获取视频链接
                </Typography>
            )}
        </Box>
    )
}
