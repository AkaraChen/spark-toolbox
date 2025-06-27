'use client'

import { useState } from 'react'
import { Box } from '@mui/material'
import { PageContainer } from '@toolpad/core'
import { BilibiliControlPanel } from '@/modules/bilibili/components/control-panel'
import { BilibiliVideoPlayer } from '@/modules/bilibili/components/video-player'

export default function BilibiliPage() {
    const [videoUrl, setVideoUrl] = useState<string | null>(null)

    const handleVideoUrlFetched = (url: string) => {
        setVideoUrl(url)
    }

    return (
        <PageContainer>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                {/* 左侧控制面板 */}
                <Box sx={{ width: { xs: '100%', md: '33.33%' } }}>
                    <BilibiliControlPanel onVideoUrlFetched={handleVideoUrlFetched} />
                </Box>

                {/* 右侧视频播放器 */}
                <Box sx={{ width: { xs: '100%', md: '66.67%' } }}>
                    <BilibiliVideoPlayer videoUrl={videoUrl} />
                </Box>
            </Box>
        </PageContainer>
    )
}
