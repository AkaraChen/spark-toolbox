'use client'

import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { PropsWithChildren } from 'react'
import { NotificationProvider } from '@/modules/universal/components/notification-provider'
import { NuqsAdapter } from 'nuqs/adapters/next/app'

const queryClient = new QueryClient()

export default function Providers({ children }: PropsWithChildren) {
    return (
        <NuqsAdapter>
            <QueryClientProvider client={queryClient}>
                <NotificationProvider>{children}</NotificationProvider>
            </QueryClientProvider>
        </NuqsAdapter>
    )
}
