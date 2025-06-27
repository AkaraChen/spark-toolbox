import { useQuery } from '@tanstack/react-query'
import { useStore } from '../universal/store/app-state'
import { useMemo } from 'react'
import OpenAI from 'openai'

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

export const useModels = () => {
    const { openaiBase, openaiKey } = useStore()
    const openai = useOpenAI()
    return useQuery({
        queryKey: ['models', openaiBase, openaiKey],
        queryFn: async ({ signal }) => {
            const models = await openai.models.list({
                signal,
            })
            return models.data
        },
        enabled: !!openai,
    })
}
