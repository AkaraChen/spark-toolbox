import * as React from 'react'
import Box from '@mui/material/Box'

interface TabPanelProps {
    children?: React.ReactNode
    index: number
    value: number
}

export function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props

    return (
        <Box
            role='tabpanel'
            hidden={value !== index}
            id={`settings-tabpanel-${index}`}
            aria-labelledby={`settings-tab-${index}`}
            {...other}
        >
            {value === index && children}
        </Box>
    )
}
