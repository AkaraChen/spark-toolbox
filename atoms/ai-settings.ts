import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { OpenAI } from 'openai'

// AI settings interface
export interface AISettings {
  openaiBase: string
  openaiKey: string
  largeModel: string
  baseModel: string
  smallModel: string
}

// Default AI settings
const DEFAULT_AI_SETTINGS: AISettings = {
  openaiBase: 'https://api.openai.com/v1',
  openaiKey: '',
  largeModel: 'gpt-4.1',
  baseModel: 'gpt-4.1-mini',
  smallModel: 'gpt-4.1-nano'
}

// Create a new OpenAI client with the given base URL and API key
function createOpenAIClient(baseURL: string, apiKey: string): OpenAI {
  return new OpenAI({
    baseURL,
    apiKey,
    dangerouslyAllowBrowser: true // Allow usage in browser environment
  })
}

// Persist AI settings in localStorage
export const aiSettingsAtom = atomWithStorage<AISettings>('ai-settings', DEFAULT_AI_SETTINGS)

// OpenAI client atom that depends on the settings
export const openAIClientAtom = atom(
  (get) => {
    const settings = get(aiSettingsAtom)
    return createOpenAIClient(settings.openaiBase, settings.openaiKey)
  }
)

// Reset AI settings
export const resetAISettingsAtom = atom(
  null,
  (_, set) => {
    set(aiSettingsAtom, DEFAULT_AI_SETTINGS)
  }
)

// Update specific AI settings
export const updateAISettingsAtom = atom(
  null,
  (_, set, update: Partial<AISettings>) => {
    set(aiSettingsAtom, (prev) => ({
      ...prev,
      ...update
    }))
  }
)
