import * as React from 'react'
import { NextAppProvider } from '@toolpad/core/nextjs'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter'
import DashboardIcon from '@mui/icons-material/Dashboard'
import ApiIcon from '@mui/icons-material/Api'
import SettingsIcon from '@mui/icons-material/Settings'
import TranslateIcon from '@mui/icons-material/Translate'
import HistoryIcon from '@mui/icons-material/History'
import PasswordIcon from '@mui/icons-material/Password'
import LinearProgress from '@mui/material/LinearProgress'
import type { Branding, Navigation } from '@toolpad/core/AppProvider'

import theme from '../theme'
import { Metadata } from 'next'
import Providers from './providers'

export const metadata: Metadata = {
    title: 'Spark',
    description: 'A Toolbox app for modern & cooool developers.',
}

const NAVIGATION: Navigation = [
    {
        kind: 'header',
        title: '菜单',
    },
    {
        segment: '',
        title: '仪表盘',
        icon: <DashboardIcon />,
    },
    {
        segment: 'one-api',
        title: 'One API',
        icon: <ApiIcon />,
    },
    {
        segment: 'translator',
        title: '翻译',
        icon: <TranslateIcon />,
    },
    {
        segment: 'changelog',
        title: '查找更新日志',
        icon: <HistoryIcon />,
    },
    {
        segment: 'password-generator',
        title: '密码生成器',
        icon: <PasswordIcon />,
    },
    {
        segment: 'settings',
        title: '系统设置',
        icon: <SettingsIcon />,
    },
]

const BRANDING: Branding = {
    title: 'Spark',
}

export default function RootLayout(props: { children: React.ReactNode }) {
    return (
        <html
            lang='en'
            data-toolpad-color-scheme='light'
            suppressHydrationWarning
        >
            <body>
                <AppRouterCacheProvider options={{ enableCssLayer: true }}>
                    <React.Suspense fallback={<LinearProgress />}>
                        <NextAppProvider
                            navigation={NAVIGATION}
                            branding={BRANDING}
                            theme={theme}
                        >
                            <Providers>{props.children}</Providers>
                        </NextAppProvider>
                    </React.Suspense>
                </AppRouterCacheProvider>
            </body>
        </html>
    )
}
