import { useAtomValue } from 'jotai'
import { openAIClientAtom, aiSettingsAtom } from '@/atoms/ai-settings'

/**
 * Hook to get the OpenAI client configured with current settings
 * @returns OpenAI client instance
 */
export function useOpenAI() {
  return useAtomValue(openAIClientAtom)
}

/**
 * Types of models available in the application
 */
export type ModelType = 'large' | 'base' | 'small'

/**
 * Hook to get the model name for a specific model type
 * @param type Model type (large, base, or small)
 * @returns Model name string
 */
export function useModelName(type: ModelType) {
  const settings = useAtomValue(aiSettingsAtom)
  
  switch (type) {
    case 'large':
      return settings.largeModel
    case 'base':
      return settings.baseModel
    case 'small':
      return settings.smallModel
    default:
      return settings.baseModel
  }
}
