'use client'

import { useEffect } from 'react'
import {
    Box,
    CircularProgress,
    FormControlLabel,
    Switch,
    Typography,
} from '@mui/material'
import { useFFmpeg } from '../hooks/use-ffmpeg'
import { FFmpeg } from '@ffmpeg/ffmpeg'

interface VideoOptionsProps {
    reverseEnabled: boolean
    onReverseChange: (enabled: boolean) => void
    isDownloading: boolean
    isProcessing: boolean
    onFFmpegLoaded: (ffmpeg: FFmpeg | null) => void
}

/**
 * 视频选项组件
 */
export function VideoOptions({
    reverseEnabled,
    onReverseChange,
    isDownloading,
    isProcessing,
    onFFmpegLoaded,
}: VideoOptionsProps) {
    // 加载FFmpeg
    const {
        ffmpeg,
        isLoading: isLoadingFFmpeg,
        isError: ffmpegError,
    } = useFFmpeg()

    // 当FFmpeg加载状态变化时，通知父组件
    useEffect(() => {
        onFFmpegLoaded(ffmpeg || null)
    }, [ffmpeg, onFFmpegLoaded])

    return (
        <Box sx={{ mb: 3 }}>
            <FormControlLabel
                control={
                    <Switch
                        checked={reverseEnabled}
                        onChange={e => onReverseChange(e.target.checked)}
                        disabled={
                            isLoadingFFmpeg || isDownloading || isProcessing
                        }
                    />
                }
                label='倒放视频'
            />
            {isLoadingFFmpeg && (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mt: 1,
                    }}
                >
                    <CircularProgress size={16} sx={{ mr: 1 }} />
                    <Typography variant='caption' color='text.secondary'>
                        加载FFmpeg中...
                    </Typography>
                </Box>
            )}
            {ffmpegError && (
                <Typography
                    variant='caption'
                    color='error'
                    sx={{ mt: 1, display: 'block' }}
                >
                    FFmpeg加载失败，倒放功能不可用
                </Typography>
            )}
        </Box>
    )
}
