import * as React from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { RealTimeClock } from '@/modules/dashboard/components/real-time-clock'

export default function DashboardPage() {
    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Welcome Back!
            </Typography>
            <Grid container spacing={3}>
                <Box sx={{ xs: 12, sm: 6, md: 4 }}>
                    <RealTimeClock />
                </Box>
                {/* You can add more cards here in the future */}
            </Grid>
        </Box>
    )
}
