import { useNotifications } from '@toolpad/core'

/**
 * Hook to access notification functions with convenience methods
 * @returns Object containing notification functions
 */
export function useNotification() {
    const notifications = useNotifications()

    return {
        showSuccess: (message: string) =>
            notifications.show(message, { severity: 'success' }),
        showError: (message: string) =>
            notifications.show(message, { severity: 'error' }),
        showWarning: (message: string) =>
            notifications.show(message, { severity: 'warning' }),
        showInfo: (message: string) =>
            notifications.show(message, { severity: 'info' }),
        ...notifications,
    }
}
