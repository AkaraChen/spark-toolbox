'use client'

import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { PropsWithChildren } from 'react'
import { NotificationProvider } from '@/modules/universal/components/notification-provider'

const queryClient = new QueryClient()

export default function Providers({ children }: PropsWithChildren) {
    return (
        <QueryClientProvider client={queryClient}>
            <NotificationProvider>
                {children}
            </NotificationProvider>
        </QueryClientProvider>
    )
}
