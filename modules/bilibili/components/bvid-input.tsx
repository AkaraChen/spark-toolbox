'use client'

import { useEffect } from 'react'
import { Box, Button, CircularProgress, TextField } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { getVideoInfo } from '../api-client'
import { VideoInfo } from '../types'
import { useQueryState } from 'nuqs'

interface BvidInputProps {
    onVideoInfoFetched: (info: VideoInfo) => void
}

/**
 * BV号输入组件
 */
export function BvidInput({ onVideoInfoFetched }: BvidInputProps) {
    const [bvid, setBvid] = useQueryState('bvid', {
        defaultValue: '',
    })

    // 获取视频信息的查询
    const {
        data: videoInfo,
        isLoading: isLoadingInfo,
        error: infoError,
        refetch: refetchInfo,
    } = useQuery({
        queryKey: ['bilibili-video-info', bvid],
        queryFn: () => getVideoInfo(bvid),
        enabled: false,
    })

    // 当视频信息加载成功时，通知父组件
    useEffect(() => {
        if (videoInfo) {
            onVideoInfoFetched(videoInfo)
        }
    }, [videoInfo, onVideoInfoFetched])

    // 处理BV号输入变化
    const handleBvidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBvid(e.target.value)
    }

    // 处理获取视频信息按钮点击
    const handleGetInfo = () => {
        if (!bvid) return
        refetchInfo()
    }

    return (
        <Box sx={{ mb: 3 }}>
            <TextField
                label='BV号'
                value={bvid}
                onChange={handleBvidChange}
                fullWidth
                placeholder='例如：BV1xx411c7mD'
                helperText='输入Bilibili视频的BV号'
                sx={{ mb: 2 }}
            />
            <Button
                variant='contained'
                onClick={handleGetInfo}
                disabled={!bvid || isLoadingInfo}
                fullWidth
            >
                {isLoadingInfo ? (
                    <CircularProgress size={24} />
                ) : (
                    '获取视频信息'
                )}
            </Button>

            {infoError && (
                <Box sx={{ color: 'error.main', mt: 2 }}>
                    获取视频信息失败，请检查BV号是否正确
                </Box>
            )}
        </Box>
    )
}
