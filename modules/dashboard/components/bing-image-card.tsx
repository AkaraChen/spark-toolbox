'use client'

import * as React from 'react'
import { useQuery } from '@tanstack/react-query'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Skeleton from '@mui/material/Skeleton'
import { getBingImage } from '../api/client'

export function BingImageCard() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['bingImage'],
        queryFn: getBingImage,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 60 * 24, // 24 hours
    })

    if (isLoading) {
        return <Skeleton variant="rectangular" width="100%" height={240} />
    }

    if (error) {
        return (
            <Card>
                <CardContent>
                    <Typography color="error">Failed to load Bing image.</Typography>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card sx={{ position: 'relative', height: '100%' }}>
            <CardMedia
                component="img"
                image={data!.url}
                alt={data!.copyright}
                sx={{ height: 240, objectFit: 'cover' }}
            />
            <CardContent
                sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    color: 'white',
                    p: 1,
                }}
            >
                <Typography variant="caption">
                    {data!.copyright}
                </Typography>
            </CardContent>
        </Card>
    )
}
