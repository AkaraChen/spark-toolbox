import { useOpenAI } from '@/modules/ai/hooks/openai'
import { useQuery } from '@tanstack/react-query'
import { Lang, auto } from '../utils/lang'
import { translate } from '../utils/translate'
import { useStore } from '@/modules/universal/store/app-state'

/**
 * Hook to translate text from one language to another
 * @param sourceText Text to translate
 * @param detectLang Detected source language
 * @param targetLanguage Target language
 * @returns Query result with translated text
 */
export const useTranslate = (
    sourceText: string,
    detectLang: Lang,
    targetLanguage: Lang,
) => {
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
        queryKey: [
            'translate',
            sourceText,
            detectLang,
            userPreferences,
            targetLanguage === auto ? undefined : targetLanguage,
        ],
        queryFn: () =>
            translate(
                {
                    text: sourceText,
                    userPreferences,
                    client,
                },
                detectLang as string,
                targetLanguage === auto
                    ? undefined
                    : (targetLanguage as string),
            ),
        enabled:
            !!detectLang && !!sourceText && !!client && detectLang !== auto,
    })
}
