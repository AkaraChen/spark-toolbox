import { useQuery } from '@tanstack/react-query'
import { useStore } from '@/modules/universal/store'
import { detectLanguage, translate, TranslateParams } from './utils/translate'
import { auto, Lang } from './utils/lang'
import { useOpenAI } from '@/modules/ai/hooks'

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
                targetLanguage === auto ? undefined : targetLanguage as string,
            ),
        enabled: !!detectLang && !!sourceText && !!client && detectLang !== auto,
    })
}
