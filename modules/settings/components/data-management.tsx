import * as React from 'react'
import { useState } from 'react'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Alert from '@mui/material/Alert'
import TextField from '@mui/material/TextField'
import CloudDownloadIcon from '@mui/icons-material/CloudDownload'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import RefreshIcon from '@mui/icons-material/Refresh'
import {
    createBackup,
    restoreFromBackup,
    downloadBackup,
} from '@/modules/settings/utils/backup'
import { useNotification } from '@/modules/universal/hooks/use-notification'

export function DataManagement() {
    const [backupData, setBackupData] = useState<string>('')
    const [restoreData, setRestoreData] = useState<string>('')
    const { showSuccess, showError } = useNotification()

    const handleBackup = () => {
        try {
            const backupJson = createBackup()
            setBackupData(backupJson)
            showSuccess('Backup data generated successfully!')
        } catch (error) {
            showError(
                `Backup failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
            )
        }
    }

    const handleDownloadBackup = () => {
        if (!backupData) return
        downloadBackup(backupData)
        showSuccess('Backup file downloaded!')
    }

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = e => {
            const content = e.target?.result as string
            setRestoreData(content)
        }
        reader.readAsText(file)
    }

    const handleRestore = () => {
        if (!restoreData) return

        try {
            const result = restoreFromBackup(restoreData)
            if (result.success) {
                showSuccess(result.message)
                // Clear the restore data field after successful restore
                setRestoreData('')
            } else {
                showError(result.message)
            }
        } catch (error) {
            showError(
                `Restore failed: ${error instanceof Error ? error.message : 'Invalid backup data'}`,
            )
        }
    }

    return (
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
                    slotProps={{
                        input: {
                            readOnly: true,
                        },
                    }}
                />
            )}

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
                    警告：恢复操作将覆盖当前所有数据，包括KV存储和应用设置。恢复后需要刷新页面以应用所有设置。
                </Alert>
                <Box
                    sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}
                >
                    <Button
                        variant='outlined'
                        color='primary'
                        startIcon={<RefreshIcon />}
                        onClick={() => window.location.reload()}
                    >
                        刷新页面
                    </Button>
                </Box>
            </Stack>
        </Stack>
    )
}
