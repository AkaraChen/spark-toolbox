'use client'

import * as React from 'react'
import { useState } from 'react'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import { useStore } from '@/modules/universal/store'
import { useNotification } from '@/modules/universal/components/notification-provider'

export function AuthorizationSettings() {
    const { githubToken, setGithubToken, resetAuthSettings } = useStore()
    const { showNotification } = useNotification()
    const [showToken, setShowToken] = useState(false)

    const handleGithubTokenChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setGithubToken(event.target.value)
    }

    const handleResetSettings = () => {
        resetAuthSettings()
        showNotification('授权设置已重置', 'info')
    }

    const toggleShowToken = () => {
        setShowToken(!showToken)
    }

    return (
        <Stack spacing={3} sx={{ py: 3 }}>
            <Box>
                <Typography variant='h6' gutterBottom>
                    GitHub 授权
                </Typography>
                <Typography variant='body2' color='text.secondary' paragraph>
                    添加 GitHub 令牌可以提高 Changelog
                    查询的速率限制，并允许访问私有仓库。
                    <Link
                        href='https://github.com/settings/tokens'
                        target='_blank'
                        sx={{ ml: 1 }}
                    >
                        创建令牌
                    </Link>
                </Typography>
            </Box>

            <TextField
                label='GitHub Token'
                fullWidth
                type={showToken ? 'text' : 'password'}
                value={githubToken || ''}
                onChange={handleGithubTokenChange}
                placeholder='ghp_...'
                helperText='您的 GitHub 个人访问令牌'
                InputProps={{
                    endAdornment: (
                        <InputAdornment position='end'>
                            <IconButton
                                aria-label='toggle token visibility'
                                onClick={toggleShowToken}
                                edge='end'
                            >
                                {showToken ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    variant='outlined'
                    color='primary'
                    onClick={handleResetSettings}
                >
                    重置设置
                </Button>
            </Box>
        </Stack>
    )
}
