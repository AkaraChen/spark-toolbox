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
    Typography 
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
export function BilibiliControlPanel({ onVideoDataFetched }: ControlPanelProps) {
    const [bvid, setBvid] = useState('')
    const [selectedCid, setSelectedCid] = useState<number | null>(null)
    const [downloadProgress, setDownloadProgress] = useState<number>(0)
    const [isDownloading, setIsDownloading] = useState<boolean>(false)
    const [reverseEnabled, setReverseEnabled] = useState<boolean>(false)
    const [isProcessing, setIsProcessing] = useState<boolean>(false)
    
    // 加载FFmpeg
    const { ffmpeg, isLoading: isLoadingFFmpeg, isError: ffmpegError } = useFFmpeg()

    // 获取视频信息的查询
    const { 
        data: videoInfo, 
        isLoading: isLoadingInfo,
        error: infoError,
        refetch: refetchInfo
    } = useQuery({
        queryKey: ['bilibili-video-info', bvid],
        queryFn: () => getVideoInfo(bvid),
        enabled: false,
    })

    // 处理BV号输入变化
    const handleBvidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBvid(e.target.value)
        setSelectedCid(null)
        setDownloadProgress(0)
    }

    // 处理获取视频信息按钮点击
    const handleGetInfo = () => {
        if (!bvid) return
        refetchInfo()
    }

    // 处理分P选择变化
    const handleCidChange = (e: SelectChangeEvent<number>) => {
        setSelectedCid(e.target.value as number)
        setDownloadProgress(0)
    }

    // 处理获取视频按钮点击
    const handleGetVideo = async () => {
        if (!bvid || !selectedCid) return
        
        try {
            setIsDownloading(true)
            setDownloadProgress(0)
            
            // 获取视频URL
            const sources = await getVideoSourceUrl(bvid, selectedCid)
            if (!sources || sources.length === 0) {
                throw new Error('No video source found')
            }
            
            const videoUrl = sources[0]
            
            // 使用downloadWithProgress下载视频数据
            let mimeType = 'video/mp4' // 默认MIME类型
            
            // 使用downloadWithProgress函数下载视频并跟踪进度
            const videoData = await downloadWithProgress(videoUrl, (progress) => {
                // 更新下载进度
                setDownloadProgress(Math.round(progress.received / progress.total * 100))
            })
            
            // 转换为Uint8Array
            const allChunks = new Uint8Array(videoData)
            
            // 尝试获取MIME类型（通过单独的HEAD请求）
            try {
                const headResponse = await fetch(videoUrl, { method: 'HEAD' })
                if (headResponse.ok) {
                    const contentType = headResponse.headers.get('content-type')
                    if (contentType) {
                        mimeType = contentType
                    }
                }
            } catch (error) {
                console.warn('Failed to get content type, using default:', error)
                // 继续使用默认MIME类型
            }
            
            // 如果启用了倒放功能且FFmpeg已加载，则处理倒放
            if (reverseEnabled && ffmpeg) {
                try {
                    setIsProcessing(true)
                    setDownloadProgress(0) // 重置进度条
                    
                    // 处理倒放
                    const reversedData = await reverseVideo(ffmpeg, allChunks, mimeType)
                    
                    // 传递倒放后的视频数据给父组件
                    onVideoDataFetched(reversedData, mimeType)
                } catch (error) {
                    console.error('Error reversing video:', error)
                    // 如果倒放失败，使用原始视频
                    onVideoDataFetched(allChunks, mimeType)
                } finally {
                    setIsProcessing(false)
                    setDownloadProgress(100)
                }
            } else {
                // 直接传递原始视频数据给父组件
                onVideoDataFetched(allChunks, mimeType)
                setDownloadProgress(100)
            }
        } catch (error) {
            console.error('Error downloading video:', error)
        } finally {
            setIsDownloading(false)
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
                    label="BV号"
                    value={bvid}
                    onChange={handleBvidChange}
                    fullWidth
                    placeholder="例如：BV1xx411c7mD"
                    helperText="输入Bilibili视频的BV号"
                    sx={{ mb: 2 }}
                />
                <Button 
                    variant="contained" 
                    onClick={handleGetInfo}
                    disabled={!bvid || isLoadingInfo}
                    fullWidth
                >
                    {isLoadingInfo ? <CircularProgress size={24} /> : '获取视频信息'}
                </Button>
            </Box>

            {videoInfo && (
                <>
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" gutterBottom>
                            {videoInfo.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            UP主: {videoInfo.owner.name}
                        </Typography>
                    </Box>

                    <FormControl fullWidth sx={{ mb: 3 }}>
                        <InputLabel id="page-select-label">选择分P</InputLabel>
                        <Select
                            labelId="page-select-label"
                            value={selectedCid || ''}
                            label="选择分P"
                            onChange={handleCidChange}
                        >
                            {videoInfo.pages.map((page) => (
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
                                    onChange={(e) => setReverseEnabled(e.target.checked)}
                                    disabled={isLoadingFFmpeg || isDownloading || isProcessing}
                                />
                            }
                            label="倒放视频"
                        />
                        {isLoadingFFmpeg && (
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                <CircularProgress size={16} sx={{ mr: 1 }} />
                                <Typography variant="caption" color="text.secondary">
                                    加载FFmpeg中...
                                </Typography>
                            </Box>
                        )}
                        {ffmpegError && (
                            <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                                FFmpeg加载失败，倒放功能不可用
                            </Typography>
                        )}
                    </Box>

                    <Box sx={{ width: '100%', mb: 2 }}>
                        {downloadProgress > 0 && downloadProgress < 100 && (
                            <Box sx={{ width: '100%', mb: 1 }}>
                                <LinearProgress variant="determinate" value={downloadProgress} />
                                <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 0.5 }}>
                                    {Math.round(downloadProgress)}%
                                </Typography>
                            </Box>
                        )}
                        <Button 
                            variant="contained" 
                            color="primary"
                            onClick={handleGetVideo}
                            disabled={!selectedCid || isDownloading}
                            fullWidth
                        >
                            {isDownloading ? <CircularProgress size={24} /> : '获取视频'}
                        </Button>
                    </Box>
                </>
            )}

            {infoError && (
                <Typography color="error" sx={{ mt: 2 }}>
                    获取视频信息失败，请检查BV号是否正确
                </Typography>
            )}
        </Paper>
    )
}
