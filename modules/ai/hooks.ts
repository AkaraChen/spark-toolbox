import { useQuery } from '@tanstack/react-query'
import { useStore } from '../universal/store'

export const useModels = () => {
    const { openai, openaiBase, openaiKey } = useStore()
    return useQuery({
        queryKey: ['models', openaiBase, openaiKey],
        queryFn: async ({ signal }) => {
            const models = await openai!.models.list({
                signal,
            })
            return models.data
        },
        enabled: !!openai,
    })
}
