'use client'

import React, { useState } from 'react'
import {
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Link,
    Stack,
    TextField,
    Typography,
} from '@mui/material'
import { useChangelogInfo } from './hooks'
import LaunchIcon from '@mui/icons-material/Launch'

/**
 * Component to search for and display package changelog information
 */
export function ChangelogFinder() {
    const [packageName, setPackageName] = useState('')
    
    const { mutate, data: result, isPending } = useChangelogInfo()

    const handleSearch = () => {
        if (!packageName.trim()) {
            return
        }
        
        mutate(packageName)
    }

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            handleSearch()
        }
    }

    return (
        <Box>
            <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                <TextField
                    label="Package Name"
                    value={packageName}
                    onChange={(e) => setPackageName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    fullWidth
                    placeholder="e.g., react, lodash, next"
                    variant="outlined"
                    size="small"
                />
                <Button
                    variant="contained"
                    onClick={handleSearch}
                    disabled={isPending}
                    sx={{ minWidth: '120px' }}
                >
                    {isPending ? <CircularProgress size={24} /> : 'Search'}
                </Button>
            </Stack>

            {result && (
                <Card variant="outlined" sx={{ mt: 2 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            {packageName}
                        </Typography>
                        
                        <Stack spacing={1}>
                            <LinkItem label="NPM" url={result.npmUrl} />
                            
                            {result.homepage && (
                                <LinkItem label="Homepage" url={result.homepage} />
                            )}
                            
                            {result.repositoryUrl && (
                                <LinkItem label="Repository" url={result.repositoryUrl} />
                            )}
                            
                            {result.changelogUrl ? (
                                <LinkItem label="Changelog" url={result.changelogUrl} />
                            ) : (
                                <Typography variant="body2" color="text.secondary">
                                    No changelog found
                                </Typography>
                            )}
                            
                            {result.releasesUrl && (
                                <LinkItem label="Releases" url={result.releasesUrl} />
                            )}
                        </Stack>
                    </CardContent>
                </Card>
            )}
        </Box>
    )
}

/**
 * Component to display a labeled link
 */
function LinkItem({ label, url }: { label: string; url: string }) {
    return (
        <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2" color="text.secondary" sx={{ width: '100px' }}>
                {label}:
            </Typography>
            <Link
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ display: 'flex', alignItems: 'center' }}
            >
                {url.length > 50 ? `${url.substring(0, 50)}...` : url}
                <LaunchIcon fontSize="small" sx={{ ml: 0.5 }} />
            </Link>
        </Stack>
    )
}
