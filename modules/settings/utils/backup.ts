import GLOBAL_STORE from '@/modules/universal/utils/kv-store'
import { STORAGE } from '@/modules/universal/constants/store'

/**
 * Interface for backup data structure
 */
export interface BackupData {
    data: Record<string, Record<string, any>>
    settings: Record<string, any>
    timestamp: string
    version: string
}

/**
 * Creates a complete backup of application settings
 * Includes both KV Store and Zustand Store data
 */
export function createBackup(): string {
    // Get KV Store data using the existing backup method
    const kvStoreData = JSON.parse(GLOBAL_STORE.backup())

    // Get Zustand Store data from localStorage
    const zustandStoreKey = STORAGE.SETTING_STORE_NAME
    const zustandStoreRaw = localStorage.getItem(zustandStoreKey)
    const zustandStore = zustandStoreRaw ? JSON.parse(zustandStoreRaw) : {}

    // Create backup object with metadata
    const backupData: BackupData = {
        data: kvStoreData,
        settings: zustandStore,
        timestamp: new Date().toISOString(),
        version: '1.0.0', // Backup format version
    }

    return JSON.stringify(backupData, null, 2)
}

/**
 * Restores application settings from backup data
 * @param backupJson JSON string containing backup data
 * @returns Object with success status and message
 */
export function restoreFromBackup(backupJson: string): {
    success: boolean
    message: string
} {
    try {
        // Parse backup data
        const backupData = JSON.parse(backupJson) as BackupData

        // Validate backup format
        if (!backupData.data || !backupData.settings || !backupData.timestamp) {
            return {
                success: false,
                message: '无效的备份数据格式',
            }
        }

        // Restore KV Store data using the existing restore method
        GLOBAL_STORE.restore(JSON.stringify(backupData.data))

        // Restore Zustand Store data
        localStorage.setItem(
            STORAGE.SETTING_STORE_NAME,
            JSON.stringify(backupData.settings),
        )

        return {
            success: true,
            message: '成功恢复数据，请刷新页面以应用所有设置',
        }
    } catch (error) {
        return {
            success: false,
            message: `恢复失败: ${error instanceof Error ? error.message : '未知错误'}`,
        }
    }
}

/**
 * Downloads backup data as a JSON file
 * @param backupData Backup data as JSON string
 */
export function downloadBackup(backupData: string): void {
    const blob = new Blob([backupData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    a.href = url
    a.download = `spark-backup-${timestamp}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
}
