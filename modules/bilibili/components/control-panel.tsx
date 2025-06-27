'use client'

import { useState } from 'react'
import { Paper } from '@mui/material'
import { useMutation, useQuery } from '@tanstack/react-query'
import { getVideoSourceUrl } from '../api/client'
import { VideoInfo } from '../api/types'
import { reverseVideo } from '../utils/reverse-video'
import { downloadWithProgress } from '@ffmpeg/util'
import { FFmpeg } from '@ffmpeg/ffmpeg'

// 导入子组件
import { BvidInput } from './bvid-input'
import { VideoInfoDisplay } from './video-info-display'
import { PageSelector } from './page-selector'
import { VideoOptions } from './video-options'
import { DownloadProgress } from './download-progress'
import { VideoActions } from './video-actions'

interface ControlPanelProps {
    onVideoDataFetched: (data: Uint8Array, mimeType: string) => void
}

/**
 * Bilibili视频控制面板组件
 */
export function BilibiliControlPanel({
    onVideoDataFetched,
}: ControlPanelProps) {
    const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null)
    const [selectedCid, setSelectedCid] = useState<number | null>(null)
    const [reverseEnabled, setReverseEnabled] = useState<boolean>(false)
    const [ffmpeg, setFFmpeg] = useState<FFmpeg | null>(null)

    // 获取视频URL的查询
    const { data: videoUrl, refetch: refetchVideoUrl } = useQuery({
        queryKey: ['bilibili-video-url', videoInfo?.bvid, selectedCid],
        queryFn: async () => {
            if (!videoInfo?.bvid || !selectedCid) return null
            const sources = await getVideoSourceUrl(videoInfo.bvid, selectedCid)
            return sources && sources.length > 0 ? sources[0] : null
        },
        enabled: false,
    })

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
            if (reverseEnabled && processVideoMutation) {
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

    // 处理视频信息获取成功
    const handleVideoInfoFetched = (info: VideoInfo) => {
        setVideoInfo(info)
        // 自动选择第一个分P
        if (info.pages.length > 0) {
            setSelectedCid(info.pages[0].cid)
        }
    }

    // 处理分P选择变化
    const handleCidChange = (cid: number) => {
        setSelectedCid(cid)
    }

    return (
        <Paper sx={{ p: 3 }}>
            {/* BV号输入组件 */}
            <BvidInput onVideoInfoFetched={handleVideoInfoFetched} />

            {videoInfo && (
                <>
                    {/* 视频信息显示组件 */}
                    <VideoInfoDisplay videoInfo={videoInfo} />

                    {/* 分P选择器组件 */}
                    <PageSelector
                        videoInfo={videoInfo}
                        selectedCid={selectedCid}
                        onCidChange={handleCidChange}
                    />

                    {/* 视频选项组件 */}
                    <VideoOptions
                        reverseEnabled={reverseEnabled}
                        onReverseChange={setReverseEnabled}
                        isDownloading={isDownloading}
                        isProcessing={processVideoMutation.isPending}
                        onFFmpegLoaded={setFFmpeg}
                    />

                    {/* 下载进度组件 */}
                    <DownloadProgress
                        progress={downloadProgress}
                        visible={downloadProgress > 0 && downloadProgress < 100}
                    />

                    {/* 视频操作组件 */}
                    <VideoActions
                        onGetVideo={handleGetVideo}
                        isDownloading={isDownloading}
                        isProcessing={processVideoMutation.isPending}
                        disabled={!selectedCid}
                    />
                </>
            )}
        </Paper>
    )
}
