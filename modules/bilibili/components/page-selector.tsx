'use client'

import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
} from '@mui/material'
import { VideoInfo } from '../types'

interface PageSelectorProps {
    videoInfo: VideoInfo
    selectedCid: number | null
    onCidChange: (cid: number) => void
}

/**
 * 视频分P选择器组件
 */
export function PageSelector({
    videoInfo,
    selectedCid,
    onCidChange,
}: PageSelectorProps) {
    const handleChange = (e: SelectChangeEvent<number>) => {
        onCidChange(e.target.value as number)
    }

    return (
        <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id='page-select-label'>选择分P</InputLabel>
            <Select
                labelId='page-select-label'
                value={selectedCid || ''}
                label='选择分P'
                onChange={handleChange}
            >
                {videoInfo.pages.map((page: { cid: number; name: string }) => (
                    <MenuItem key={page.cid} value={page.cid}>
                        {page.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}
