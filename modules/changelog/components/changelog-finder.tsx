'use client'

import React, { useState } from 'react'
import {
    Box,
    Button,
    CircularProgress,
    Link,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
} from '@mui/material'
import { useChangelogInfo } from '../hooks'

/**
 * Component to search for and display package changelog information
 */
export function ChangelogFinder() {
    const [packageName, setPackageName] = useState('')
    const { mutate, data: result, isPending } = useChangelogInfo()

    const handleSearch = () => {
        if (!packageName.trim()) return
        mutate(packageName)
    }

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') handleSearch()
    }

    return (
        <>
            <Box sx={{ display: 'flex', mb: 2, gap: 1 }}>
                <TextField
                    value={packageName}
                    onChange={e => setPackageName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder='Package name'
                    size='small'
                    fullWidth
                />
                <Button
                    onClick={handleSearch}
                    disabled={isPending}
                    variant='contained'
                >
                    {isPending ? <CircularProgress size={20} /> : 'Search'}
                </Button>
            </Box>

            {result && (
                <Paper>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Type</TableCell>
                                    <TableCell>URL</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell>NPM</TableCell>
                                    <TableCell>
                                        <Link
                                            href={result.npmUrl}
                                            target='_blank'
                                        >
                                            {result.npmUrl}
                                        </Link>
                                    </TableCell>
                                </TableRow>

                                {result.homepage && (
                                    <TableRow>
                                        <TableCell>Homepage</TableCell>
                                        <TableCell>
                                            <Link
                                                href={result.homepage}
                                                target='_blank'
                                            >
                                                {result.homepage}
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                )}

                                {result.repositoryUrl && (
                                    <TableRow>
                                        <TableCell>Repository</TableCell>
                                        <TableCell>
                                            <Link
                                                href={result.repositoryUrl}
                                                target='_blank'
                                            >
                                                {result.repositoryUrl}
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                )}

                                <TableRow>
                                    <TableCell>Changelog</TableCell>
                                    <TableCell>
                                        {result.changelogUrl ? (
                                            <Link
                                                href={result.changelogUrl}
                                                target='_blank'
                                            >
                                                {result.changelogUrl}
                                            </Link>
                                        ) : (
                                            'No changelog found'
                                        )}
                                    </TableCell>
                                </TableRow>

                                {result.releasesUrl && (
                                    <TableRow>
                                        <TableCell>Releases</TableCell>
                                        <TableCell>
                                            <Link
                                                href={result.releasesUrl}
                                                target='_blank'
                                            >
                                                {result.releasesUrl}
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            )}
        </>
    )
}
