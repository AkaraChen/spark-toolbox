'use client'

import { useState } from 'react'
import {
    Box,
    Button,
    CircularProgress,
    FormControl,
    FormControlLabel,
    InputLabel,
    LinearProgress,
    MenuItem,
    Paper,
    Select,
    SelectChangeEvent,
    Switch,
    TextField,
    Typography,
} from '@mui/material'
import { useQuery, useMutation } from '@tanstack/react-query'
import { getVideoInfo, getVideoSourceUrl } from '../api-client'
import { VideoInfo } from '../type'
import { useFFmpeg } from '../hooks/use-ffmpeg'
import { reverseVideo } from '../utils/reverse-video'
import { downloadWithProgress } from '@ffmpeg/util'

interface ControlPanelProps {
    onVideoDataFetched: (data: Uint8Array, mimeType: string) => void
}

/**
 * Bilibili视频控制面板组件
 */
export function BilibiliControlPanel({
    onVideoDataFetched,
}: ControlPanelProps) {
    const [bvid, setBvid] = useState('')
    const [selectedCid, setSelectedCid] = useState<number | null>(null)
    const [reverseEnabled, setReverseEnabled] = useState<boolean>(false)

    // 加载FFmpeg
    const {
        ffmpeg,
        isLoading: isLoadingFFmpeg,
        isError: ffmpegError,
    } = useFFmpeg()

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

    // 获取视频URL的查询
    const { data: videoUrl, refetch: refetchVideoUrl } = useQuery({
        queryKey: ['bilibili-video-url', bvid, selectedCid],
        queryFn: async () => {
            if (!bvid || !selectedCid) return null
            const sources = await getVideoSourceUrl(bvid, selectedCid)
            return sources && sources.length > 0 ? sources[0] : null
        },
        enabled: false,
    })

    // 处理BV号输入变化
    const handleBvidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBvid(e.target.value)
        setSelectedCid(null)
    }

    // 处理获取视频信息按钮点击
    const handleGetInfo = () => {
        if (!bvid) return
        refetchInfo()
    }

    // 处理分P选择变化
    const handleCidChange = (e: SelectChangeEvent<number>) => {
        setSelectedCid(e.target.value as number)
    }

    // 管理下载进度状态
    const [downloadProgress, setDownloadProgress] = useState<number>(0)

    // 使用useMutation下载视频
    const { mutate: downloadVideo, isPending: isDownloading } = useMutation({
        mutationFn: async (url: string) => {
            // 重置进度
            setDownloadProgress(0)

            // 使用downloadWithProgress函数下载视频并跟踪进度
            const videoData = await downloadWithProgress(url, progress => {
                // 更新进度百分比
                const progressPercent = Math.round(
                    (progress.received / progress.total) * 100,
                )
                setDownloadProgress(progressPercent)
                return progressPercent
            })

            // 获取MIME类型
            let mimeType = 'video/mp4' // 默认MIME类型
            try {
                const headResponse = await fetch(url, { method: 'HEAD' })
                if (headResponse.ok) {
                    const contentType = headResponse.headers.get('content-type')
                    if (contentType) {
                        mimeType = contentType
                    }
                }
            } catch (error) {
                console.warn(
                    'Failed to get content type, using default:',
                    error,
                )
            }

            // 下载完成
            setDownloadProgress(100)

            return {
                data: new Uint8Array(videoData),
                mimeType,
            }
        },
        onSuccess: result => {
            if (reverseEnabled && ffmpeg) {
                // 如果启用了倒放，则处理倒放
                processVideoMutation.mutate(result)
            } else {
                // 直接传递原始视频数据
                onVideoDataFetched(result.data, result.mimeType)
            }
        },
    })

    // 使用useMutation处理视频倒放
    const processVideoMutation = useMutation({
        mutationFn: async (videoResult: {
            data: Uint8Array
            mimeType: string
        }) => {
            if (!ffmpeg) throw new Error('FFmpeg not loaded')

            // 处理倒放
            const reversedData = await reverseVideo(
                ffmpeg,
                videoResult.data,
                videoResult.mimeType,
            )
            return {
                data: reversedData,
                mimeType: videoResult.mimeType,
            }
        },
        onSuccess: result => {
            // 传递倒放后的视频数据
            onVideoDataFetched(result.data, result.mimeType)
        },
        onError: (_, videoResult) => {
            // 如果倒放失败，使用原始视频
            console.error('Error reversing video, using original video')
            onVideoDataFetched(videoResult.data, videoResult.mimeType)
        },
    })

    // 处理获取视频按钮点击
    const handleGetVideo = () => {
        if (!videoUrl) {
            // 如果还没有获取到URL，先获取URL
            refetchVideoUrl().then(result => {
                if (result.data) {
                    downloadVideo(result.data)
                }
            })
        } else {
            // 直接使用已有的URL
            downloadVideo(videoUrl)
        }
    }

    // 当视频信息加载完成后，自动选择第一个分P
    if (videoInfo && videoInfo.pages.length > 0 && !selectedCid) {
        setSelectedCid(videoInfo.pages[0].cid)
    }

    return (
        <Paper sx={{ p: 3 }}>
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
            </Box>

            {videoInfo && (
                <>
                    <Box sx={{ mb: 3 }}>
                        <Typography variant='subtitle1' gutterBottom>
                            {videoInfo.title}
                        </Typography>
                        <Typography variant='body2' color='text.secondary'>
                            UP主: {videoInfo.owner.name}
                        </Typography>
                    </Box>

                    <FormControl fullWidth sx={{ mb: 3 }}>
                        <InputLabel id='page-select-label'>选择分P</InputLabel>
                        <Select
                            labelId='page-select-label'
                            value={selectedCid || ''}
                            label='选择分P'
                            onChange={handleCidChange}
                        >
                            {videoInfo.pages.map(page => (
                                <MenuItem key={page.cid} value={page.cid}>
                                    {page.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Box sx={{ mb: 3 }}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={reverseEnabled}
                                    onChange={e =>
                                        setReverseEnabled(e.target.checked)
                                    }
                                    disabled={
                                        isLoadingFFmpeg ||
                                        isDownloading ||
                                        processVideoMutation.isPending
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
                                <Typography
                                    variant='caption'
                                    color='text.secondary'
                                >
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

                    <Box sx={{ width: '100%', mb: 2 }}>
                        {downloadProgress > 0 && downloadProgress < 100 && (
                            <Box sx={{ width: '100%', mb: 1 }}>
                                <LinearProgress
                                    variant='determinate'
                                    value={downloadProgress}
                                />
                                <Typography
                                    variant='body2'
                                    color='text.secondary'
                                    align='center'
                                    sx={{ mt: 0.5 }}
                                >
                                    {Math.round(downloadProgress)}%
                                </Typography>
                            </Box>
                        )}
                        <Button
                            variant='contained'
                            color='primary'
                            onClick={handleGetVideo}
                            disabled={
                                !selectedCid ||
                                isDownloading ||
                                processVideoMutation.isPending
                            }
                            fullWidth
                        >
                            {isDownloading ? (
                                <CircularProgress size={24} />
                            ) : processVideoMutation.isPending ? (
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
                </>
            )}

            {infoError && (
                <Typography color='error' sx={{ mt: 2 }}>
                    获取视频信息失败，请检查BV号是否正确
                </Typography>
            )}
        </Paper>
    )
}
