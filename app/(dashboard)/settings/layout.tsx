import * as React from 'react'
import { PageContainer } from '@toolpad/core'

export default function Layout(props: { children: React.ReactNode }) {
    return <PageContainer>{props.children}</PageContainer>
}
