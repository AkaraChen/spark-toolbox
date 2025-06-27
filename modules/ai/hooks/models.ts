import { useStore } from '@/modules/universal/store/app-state'
import { useQuery } from '@tanstack/react-query'
import { useOpenAI } from './openai'

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
