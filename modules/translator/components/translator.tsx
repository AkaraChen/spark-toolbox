'use client'

import { useState, ChangeEvent } from 'react'
import { 
    Box, 
    Button, 
    TextField, 
    Stack, 
    Typography, 
    Chip,
    IconButton
} from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import ContentPasteIcon from '@mui/icons-material/ContentPaste'
import LockIcon from '@mui/icons-material/Lock'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import { useDebounce } from '../../universal/hooks/use-debounce'
import { auto, Lang } from '../utils/lang'
import { useDetectLang, useTranslate } from '../hooks'
import { useStore } from '@/modules/universal/store'
import { useNotification } from '../../universal/hooks/use-notification'
import { LanguageSelector } from './language-selector'

export function Translator() {
    const [sourceText, setSourceText] = useState('')
    const debouncedSourceText = useDebounce(sourceText, 500)
    const [targetLanguage, setTargetLanguage] = useState<Lang>(auto)
    const store = useStore()
    const { showSuccess, showError } = useNotification()

    // Handle source text change
    const handleSourceTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setSourceText(e.target.value)
    }

    // Language detection
    const detectLang = useDetectLang(debouncedSourceText)

    // Translation
    const translate = useTranslate(
        debouncedSourceText, 
        detectLang.data || '', 
        targetLanguage
    )

    // Copy translated text to clipboard
    const handleCopy = async () => {
        if (translate.data) {
            try {
                await navigator.clipboard.writeText(translate.data)
                showSuccess('已复制到剪贴板')
            } catch (error) {
                showError('复制失败')
            }
        }
    }

    // Paste from clipboard
    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText()
            setSourceText(text)
            showSuccess('已从剪贴板粘贴')
        } catch (error) {
            showError('粘贴失败')
        }
    }

    // Get target language display
    const getTargetLanguageDisplay = () => {
        if (targetLanguage !== auto) return targetLanguage as string
        
        if (debouncedSourceText && detectLang.data) {
            return detectLang.data === store.primaryLanguage
                ? store.targetLanguage
                : store.primaryLanguage
        }
        
        return '自动'
    }

    return (
        <Box>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                {/* Source text area - left side */}
                <Box sx={{ width: { xs: '100%', md: '50%' } }}>
                    <Stack spacing={2}>
                        <Box>
                            <Typography variant="subtitle1" component="label" htmlFor="source">
                                源文本
                                {detectLang.data && (
                                    <Chip 
                                        label={detectLang.data} 
                                        size="small" 
                                        sx={{ ml: 1 }} 
                                    />
                                )}
                                {detectLang.isLoading && (
                                    <Chip 
                                        label="检测中..." 
                                        size="small" 
                                        sx={{ ml: 1, opacity: 0.7 }} 
                                    />
                                )}
                            </Typography>
                        </Box>
                        <TextField
                            id="source"
                            multiline
                            rows={10}
                            placeholder="输入要翻译的文本..."
                            fullWidth
                            value={sourceText}
                            onChange={handleSourceTextChange}
                            sx={{ '& .MuiOutlinedInput-root': { height: '100%' } }}
                        />
                        <Stack direction="row" spacing={2}>
                            <Button
                                variant="contained"
                                disabled={!translate.data}
                                onClick={handleCopy}
                                startIcon={<ContentCopyIcon />}
                            >
                                复制
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={handlePaste}
                                startIcon={<ContentPasteIcon />}
                            >
                                粘贴
                            </Button>
                        </Stack>
                    </Stack>
                </Box>

                {/* Target text area - right side */}
                <Box sx={{ width: { xs: '100%', md: '50%' } }}>
                    <Stack spacing={2}>
                        <Box>
                            <Typography variant="subtitle1" component="label" htmlFor="target">
                                翻译文本
                                {targetLanguage === auto && debouncedSourceText && detectLang.data && (
                                    <Chip 
                                        label={getTargetLanguageDisplay()} 
                                        size="small" 
                                        sx={{ ml: 1 }} 
                                    />
                                )}
                            </Typography>
                        </Box>
                        <TextField
                            id="target"
                            multiline
                            rows={10}
                            placeholder={
                                detectLang.isLoading
                                    ? '检测语言中...'
                                    : translate.isLoading
                                    ? '翻译中...'
                                    : '翻译结果将显示在这里...'
                            }
                            fullWidth
                            value={translate.data || ''}
                            InputProps={{ readOnly: true }}
                            sx={{ '& .MuiOutlinedInput-root': { height: '100%' } }}
                        />
                        <Stack direction="row" spacing={2} alignItems="center">
                            <LanguageSelector
                                value={targetLanguage === auto ? 'auto' : targetLanguage as string}
                                onChange={(value: string) => {
                                    if (value === 'auto') {
                                        setTargetLanguage(auto)
                                    } else {
                                        setTargetLanguage(value)
                                    }
                                }}
                                disabled={detectLang.isLoading || translate.isLoading}
                            />
                            <IconButton
                                onClick={() => setTargetLanguage(auto)}
                                disabled={targetLanguage === auto}
                                aria-label={targetLanguage === auto ? "锁定翻译语言" : "自动选择翻译语言"}
                            >
                                {targetLanguage !== auto ? <LockIcon /> : <LockOpenIcon />}
                            </IconButton>
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </Box>
    )
}
