import { StateCreator } from 'zustand'
import { AppState } from '../types'

// AI settings interface
export interface AISettings {
  openaiBase: string
  openaiKey: string
  largeModel: string
  baseModel: string
  smallModel: string
}

// AI settings slice
export interface AISettingsSlice {
  ai: AISettings
  updateAISettings: (settings: Partial<AISettings>) => void
  resetAISettings: () => void
}

// Default AI settings
const DEFAULT_AI_SETTINGS: AISettings = {
  openaiBase: 'https://api.openai.com/v1',
  openaiKey: '',
  largeModel: 'gpt-4.1',
  baseModel: 'gpt-4.1-mini',
  smallModel: 'gpt-4.1-nano'
}

// Create AI settings slice
export const createAISettingsSlice: StateCreator<
  AppState,
  [],
  [],
  AISettingsSlice
> = (set) => ({
  ai: DEFAULT_AI_SETTINGS,
  
  updateAISettings: (newSettings) => 
    set((state) => ({
      ai: {
        ...state.ai,
        ...newSettings
      }
    })),
  
  resetAISettings: () => 
    set(() => ({
      ai: DEFAULT_AI_SETTINGS
    }))
})
