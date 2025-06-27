import { useQuery } from '@tanstack/react-query'
import { useStore } from '@/modules/universal/store/app-state'
import { detectLanguage, translate } from '../utils/translate'
import { auto, Lang } from '../utils/lang'
import { useOpenAI } from '@/modules/ai/hooks/openai'

/**
 * Hook to detect the language of the provided text
 * @param sourceText Text to detect language for
 * @returns Query result with detected language
 */
export const useDetectLang = (sourceText: string) => {
    const store = useStore()
    const client = useOpenAI()

    // Extract user preferences from store
    const userPreferences = {
        primaryLanguage: store.primaryLanguage || 'English',
        targetLanguage: store.targetLanguage || 'Chinese',
        largeModel: store.largeModel,
        smallModel: store.smallModel,
    }

    return useQuery({
        queryKey: ['detectLang', sourceText, userPreferences],
        queryFn: () =>
            detectLanguage({
                text: sourceText,
                userPreferences,
                client,
            }),
        enabled: !!sourceText && !!client,
    })
}
