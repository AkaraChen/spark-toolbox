import { useNotification as useBaseNotification } from '../components/notification-provider'

/**
 * Hook to access notification functions with convenience methods
 * @returns Object containing notification functions
 */
export function useNotification() {
    const { showNotification } = useBaseNotification()
    
    return {
        showNotification,
        showSuccess: (message: string) => showNotification(message, 'success'),
        showError: (message: string) => showNotification(message, 'error'),
        showWarning: (message: string) => showNotification(message, 'warning'),
        showInfo: (message: string) => showNotification(message, 'info')
    }
}
