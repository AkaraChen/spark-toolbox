'use client'

import { useState } from 'react'
import { 
    Box, 
    Button, 
    Card, 
    CircularProgress, 
    FormControl, 
    Grid, 
    InputLabel, 
    MenuItem, 
    Paper, 
    Select, 
    SelectChangeEvent, 
    TextField, 
    Typography 
} from '@mui/material'
import { useQuery, useMutation } from '@tanstack/react-query'
import { getVideoInfo, getVideoSourceUrl } from './api-client'
import { VideoInfo } from './type'

/**
 * Bilibili视频播放器组件
 */
export function BilibiliPlayer() {
    const [bvid, setBvid] = useState('')
    const [selectedCid, setSelectedCid] = useState<number | null>(null)
    const [videoUrl, setVideoUrl] = useState<string | null>(null)

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

    // 获取视频URL的mutation
    const { 
        mutate: fetchVideoUrl, 
        isPending: isLoadingUrl 
    } = useMutation({
        mutationFn: async ({ bvid, cid }: { bvid: string; cid: number }) => {
            const sources = await getVideoSourceUrl(bvid, cid)
            if (sources && sources.length > 0) {
                setVideoUrl(sources[0])
                return sources[0]
            }
            throw new Error('No video source found')
        },
    })

    // 处理BV号输入变化
    const handleBvidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBvid(e.target.value)
        setSelectedCid(null)
        setVideoUrl(null)
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

    // 处理获取视频URL按钮点击
    const handleGetVideoUrl = () => {
        if (!bvid || !selectedCid) return
        fetchVideoUrl({ bvid, cid: selectedCid })
    }

    // 当视频信息加载完成后，自动选择第一个分P
    if (videoInfo && videoInfo.pages.length > 0 && !selectedCid) {
        setSelectedCid(videoInfo.pages[0].cid)
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
            {/* 左侧表单 */}
            <Box sx={{ width: { xs: '100%', md: '33.33%' } }}>
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

                            <Button 
                                variant="contained" 
                                color="primary"
                                onClick={handleGetVideoUrl}
                                disabled={!selectedCid || isLoadingUrl}
                                fullWidth
                            >
                                {isLoadingUrl ? <CircularProgress size={24} /> : '获取视频链接'}
                            </Button>
                        </>
                    )}

                    {infoError && (
                        <Typography color="error" sx={{ mt: 2 }}>
                            获取视频信息失败，请检查BV号是否正确
                        </Typography>
                    )}
                </Paper>
            </Box>

            {/* 右侧视频播放区 */}
            <Box sx={{ width: { xs: '100%', md: '66.67%' } }}>
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
            </Box>
        </Box>
    )
}
