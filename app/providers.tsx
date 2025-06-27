'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@mui/material/styles'
import { NotificationsProvider } from '@toolpad/core'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { PropsWithChildren } from 'react'
import theme from '../theme'

const queryClient = new QueryClient()

export default function Providers({ children }: PropsWithChildren) {
    return (
        <NuqsAdapter>
            <ThemeProvider theme={theme}>
                <NotificationsProvider>
                    <QueryClientProvider client={queryClient}>
                        {children}
                    </QueryClientProvider>
                </NotificationsProvider>
            </ThemeProvider>
        </NuqsAdapter>
    )
}
