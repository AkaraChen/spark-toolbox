'use client'

import dynamic from 'next/dynamic'

const DynamicMasonry = dynamic(
    () =>
        import('@/modules/dashboard/components/masonry').then(
            m => m.DashboardMasonry,
        ),
    { ssr: false },
)

export default function DashboardPage() {
    return <DynamicMasonry />
}
