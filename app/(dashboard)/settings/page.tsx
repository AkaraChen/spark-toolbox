'use client'

import * as React from 'react'
import { useState } from 'react'
import Box from '@mui/material/Box'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Paper from '@mui/material/Paper'
import { AISettings } from '@/modules/settings/components/ai-settings'
import { AuthorizationSettings } from '@/modules/settings/components/authorization-settings'
import { DataManagement } from '@/modules/settings/components/data-management'

interface TabPanelProps {
    children?: React.ReactNode
    index: number
    value: number
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props

    return (
        <div
            role='tabpanel'
            hidden={value !== index}
            id={`settings-tabpanel-${index}`}
            aria-labelledby={`settings-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ pt: 1 }}>{children}</Box>}
        </div>
    )
}

export default function SettingsPage() {
    const [tabValue, setTabValue] = useState(0)

    const handleTabChange = (
        _event: React.SyntheticEvent,
        newValue: number,
    ) => {
        setTabValue(newValue)
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    aria-label='设置选项卡'
                >
                    <Tab label='AI设置' />
                    <Tab label='授权设置' />
                    <Tab label='数据管理' />
                </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
                <AISettings />
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
                <AuthorizationSettings />
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
                <DataManagement />
            </TabPanel>
        </Box>
    )
}
