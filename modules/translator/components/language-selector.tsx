'use client'

import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
} from '@mui/material'
import { auto, langs } from '../utils/lang'

interface LanguageSelectorProps {
    value: string
    onChange: (value: string) => void
    disabled?: boolean
    label?: string
    sx?: any
}

export function LanguageSelector({
    value,
    onChange,
    disabled = false,
    label = '目标语言',
    sx = {},
}: LanguageSelectorProps) {
    const handleChange = (event: SelectChangeEvent) => {
        onChange(event.target.value)
    }

    return (
        <FormControl
            sx={{ minWidth: 120, ...sx }}
            size='small'
            disabled={disabled}
        >
            <InputLabel id='language-select-label'>{label}</InputLabel>
            <Select
                labelId='language-select-label'
                id='language-select'
                value={value}
                label={label}
                onChange={handleChange}
            >
                <MenuItem value='auto'>自动</MenuItem>
                {langs.map(lang => (
                    <MenuItem key={lang} value={lang}>
                        {lang}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}
