'use client'

import * as React from 'react'
import { useState } from 'react'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { DataManagement } from '@/modules/settings/components/data-management'
import { AISettings } from '@/modules/settings/components/ai-settings'
import { NotificationProvider } from '@/modules/universal/notification-provider'
import { a11yProps, TabPanel } from '@/modules/universal/tab-panel'
import { PageContainer } from '@toolpad/core'

export default function SettingsPage() {
    const [tabValue, setTabValue] = useState(0)

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue)
    }
    
    return (
        <NotificationProvider>
            <PageContainer>
                <Box sx={{ width: '100%' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                        <Tabs 
                            value={tabValue} 
                            onChange={handleTabChange} 
                            aria-label="设置选项卡"
                        >
                            <Tab 
                                label="系统设置" 
                                {...a11yProps(0)} 
                            />
                            <Tab 
                                label="数据管理" 
                                {...a11yProps(1)} 
                            />
                        </Tabs>
                    </Box>
                    
                    <TabPanel value={tabValue} index={0}>
                        <AISettings />
                    </TabPanel>
                    
                    <TabPanel value={tabValue} index={1}>
                        <DataManagement />
                    </TabPanel>
                </Box>
            </PageContainer>
        </NotificationProvider>
    )
}
