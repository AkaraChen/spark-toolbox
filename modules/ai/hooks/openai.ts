import { useStore } from '@/modules/universal/store/app-state'
import OpenAI from 'openai'
import { useMemo } from 'react'

export const useOpenAI = () => {
    const { openaiBase, openaiKey } = useStore()
    return useMemo(() => {
        return new OpenAI({
            baseURL: openaiBase,
            apiKey: openaiKey,
            dangerouslyAllowBrowser: true,
        })
    }, [openaiBase, openaiKey])
}
