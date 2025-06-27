'use client'

import { useState } from 'react'
import { Box } from '@mui/material'
import { PageContainer } from '@toolpad/core'
import { BilibiliControlPanel } from '@/modules/bilibili/components/control-panel'
import { BilibiliVideoPlayer } from '@/modules/bilibili/components/video-player'

export default function BilibiliPage() {
    const [videoData, setVideoData] = useState<Uint8Array | null>(null)
    const [mimeType, setMimeType] = useState<string>('video/mp4')

    const handleVideoDataFetched = (data: Uint8Array, type: string) => {
        setVideoData(data)
        setMimeType(type)
    }

    return (
        <PageContainer>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                {/* 左侧控制面板 */}
                <Box sx={{ width: { xs: '100%', md: '33.33%' } }}>
                    <BilibiliControlPanel onVideoDataFetched={handleVideoDataFetched} />
                </Box>

                {/* 右侧视频播放器 */}
                <Box sx={{ width: { xs: '100%', md: '66.67%' } }}>
                    <BilibiliVideoPlayer videoData={videoData} mimeType={mimeType} />
                </Box>
            </Box>
        </PageContainer>
    )
}
