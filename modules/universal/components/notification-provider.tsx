import * as React from 'react'
import { createContext, useContext, useState } from 'react'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'

interface NotificationState {
    open: boolean
    message: string
    severity: 'success' | 'info' | 'warning' | 'error'
}

interface NotificationContextType {
    showNotification: (
        message: string,
        severity: 'success' | 'info' | 'warning' | 'error',
    ) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(
    undefined,
)

export function useNotification() {
    const context = useContext(NotificationContext)
    if (!context) {
        throw new Error(
            'useNotification must be used within a NotificationProvider',
        )
    }
    return context
}

interface NotificationProviderProps {
    children: React.ReactNode
}

export function NotificationProvider({ children }: NotificationProviderProps) {
    const [notification, setNotification] = useState<NotificationState>({
        open: false,
        message: '',
        severity: 'info',
    })

    const handleCloseNotification = () => {
        setNotification(prev => ({ ...prev, open: false }))
    }

    const showNotification = (
        message: string,
        severity: 'success' | 'info' | 'warning' | 'error',
    ) => {
        setNotification({
            open: true,
            message,
            severity,
        })
    }

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
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
        </NotificationContext.Provider>
    )
}
