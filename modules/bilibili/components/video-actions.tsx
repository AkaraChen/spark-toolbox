'use client'

import { Box, Button, CircularProgress } from '@mui/material'

interface VideoActionsProps {
    onGetVideo: () => void
    isDownloading: boolean
    isProcessing: boolean
    disabled: boolean
}

/**
 * 视频操作组件
 */
export function VideoActions({
    onGetVideo,
    isDownloading,
    isProcessing,
    disabled,
}: VideoActionsProps) {
    return (
        <Box sx={{ width: '100%', mb: 2 }}>
            <Button
                variant='contained'
                color='primary'
                onClick={onGetVideo}
                disabled={disabled || isDownloading || isProcessing}
                fullWidth
            >
                {isDownloading ? (
                    <CircularProgress size={24} />
                ) : isProcessing ? (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                        }}
                    >
                        <CircularProgress size={24} /> 倒放处理中
                    </Box>
                ) : (
                    '获取视频'
                )}
            </Button>
        </Box>
    )
}
