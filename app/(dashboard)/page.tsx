'use client'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import dynamic from 'next/dynamic'

const Masonry = dynamic(
    () =>
        import('@/modules/dashboard/components/masonry').then(
            m => m.DashboardMasonry,
        ),
    { ssr: false },
)

export default function DashboardPage() {
    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
            <Typography variant='h4' gutterBottom>
                Welcome Back!
            </Typography>
            <Masonry />
        </Box>
    )
}
