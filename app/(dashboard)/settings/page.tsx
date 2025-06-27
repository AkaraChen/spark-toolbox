'use client'

import * as React from 'react'
import { useState } from 'react'
import Typography from '@mui/material/Typography'
import { PageContainer } from '@toolpad/core/PageContainer'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import TextField from '@mui/material/TextField'
import CloudDownloadIcon from '@mui/icons-material/CloudDownload'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import Divider from '@mui/material/Divider'
import GLOBAL_STORE from '@/utils/kv-store'

export default function SettingsPage() {
    const [backupData, setBackupData] = useState<string>('')
    const [restoreData, setRestoreData] = useState<string>('')
    const [notification, setNotification] = useState<{
        open: boolean
        message: string
        severity: 'success' | 'error' | 'info' | 'warning'
    }>({
        open: false,
        message: '',
        severity: 'info',
    })

    // 创建备份
    const handleBackup = () => {
        try {
            const data = GLOBAL_STORE.backup()
            setBackupData(data)
            setNotification({
                open: true,
                message: '备份数据已生成',
                severity: 'success',
            })
        } catch (error) {
            console.error('备份失败:', error)
            setNotification({
                open: true,
                message: '备份失败',
                severity: 'error',
            })
        }
    }

    // 下载备份文件
    const handleDownloadBackup = () => {
        if (!backupData) {
            setNotification({
                open: true,
                message: '请先生成备份数据',
                severity: 'warning',
            })
            return
        }

        const blob = new Blob([backupData], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `spark-backup-${new Date().toISOString().slice(0, 10)}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    // 恢复数据
    const handleRestore = () => {
        if (!restoreData) {
            setNotification({
                open: true,
                message: '请输入或上传备份数据',
                severity: 'warning',
            })
            return
        }

        try {
            GLOBAL_STORE.restore(restoreData)
            setNotification({
                open: true,
                message: '数据已成功恢复',
                severity: 'success',
            })
        } catch (error) {
            console.error('恢复失败:', error)
            setNotification({
                open: true,
                message: '恢复失败，备份数据格式可能不正确',
                severity: 'error',
            })
        }
    }

    // 处理文件上传
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = e => {
            const content = e.target?.result as string
            setRestoreData(content)
            setNotification({
                open: true,
                message: '备份文件已加载',
                severity: 'info',
            })
        }
        reader.readAsText(file)
    }

    // 关闭通知
    const handleCloseNotification = () => {
        setNotification({ ...notification, open: false })
    }

    return (
        <PageContainer>
            <Paper sx={{ p: 3, mb: 4 }}>
                <Typography variant='h6' gutterBottom>
                    数据备份
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Stack spacing={2}>
                    <Box>
                        <Button
                            variant='contained'
                            onClick={handleBackup}
                            sx={{ mr: 2 }}
                        >
                            生成备份
                        </Button>
                        <Button
                            variant='outlined'
                            startIcon={<CloudDownloadIcon />}
                            onClick={handleDownloadBackup}
                            disabled={!backupData}
                        >
                            下载备份文件
                        </Button>
                    </Box>
                    {backupData && (
                        <TextField
                            label='备份数据'
                            multiline
                            rows={6}
                            value={backupData}
                            fullWidth
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    )}
                </Stack>
            </Paper>

            <Paper sx={{ p: 3 }}>
                <Typography variant='h6' gutterBottom>
                    数据恢复
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Stack spacing={2}>
                    <Box>
                        <Button
                            variant='contained'
                            component='label'
                            startIcon={<CloudUploadIcon />}
                            sx={{ mr: 2 }}
                        >
                            上传备份文件
                            <input
                                type='file'
                                hidden
                                accept='.json'
                                onChange={handleFileUpload}
                            />
                        </Button>
                        <Button
                            variant='outlined'
                            onClick={handleRestore}
                            disabled={!restoreData}
                        >
                            恢复数据
                        </Button>
                    </Box>
                    <TextField
                        label='恢复数据'
                        multiline
                        rows={6}
                        value={restoreData}
                        onChange={e => setRestoreData(e.target.value)}
                        fullWidth
                        placeholder='粘贴备份数据或上传备份文件'
                    />
                    <Alert severity='warning'>
                        警告：恢复操作将覆盖当前所有数据，请确保您有正确的备份文件。
                    </Alert>
                </Stack>
            </Paper>

            <Snackbar
                open={notification.open}
                autoHideDuration={6000}
                onClose={handleCloseNotification}
            >
                <Alert
                    onClose={handleCloseNotification}
                    severity={notification.severity}
                    sx={{ width: '100%' }}
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </PageContainer>
    )
}
