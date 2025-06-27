'use client'

import * as React from 'react'
import { ChangelogFinder } from '@/modules/changelog/components'
import { PageContainer } from '@toolpad/core/PageContainer'

export default function ChangelogPage() {
    return (
        <PageContainer>
            <ChangelogFinder />
        </PageContainer>
    )
}
