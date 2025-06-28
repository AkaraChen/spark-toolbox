'use client'

import * as React from 'react'
import { useQuery } from '@tanstack/react-query'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Skeleton from '@mui/material/Skeleton'
import Link from '@mui/material/Link'
import { getBingImage } from '../api/client'

export function BingImageCard() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['bingImage'],
        queryFn: getBingImage,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 60 * 24, // 24 hours
    })

    const cardStyles = {
        width: 360,
        height: 240,
        position: 'relative',
    }

    const renderContent = () => {
        if (isLoading) {
            return <Skeleton variant='rectangular' width='100%' height='100%' />
        }

        if (error || !data) {
            return (
                <CardContent
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                    }}
                >
                    <Typography color='error' align='center'>
                        Failed to load Bing image.
                    </Typography>
                </CardContent>
            )
        }

        return (
            <>
                <CardMedia
                    component='img'
                    image={data.url}
                    alt={data.copyright}
                    sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                    }}
                />
                <CardContent
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        color: 'white',
                    }}
                >
                    <Typography variant='body2'>
                        <Link
                            href={data.copyright_link}
                            target='_blank'
                            rel='noopener'
                            color='inherit'
                        >
                            {data.copyright}
                        </Link>
                    </Typography>
                </CardContent>
            </>
        )
    }

    return <Card sx={cardStyles}>{renderContent()}</Card>
}
