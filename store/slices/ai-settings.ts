import { StateCreator } from 'zustand'
import { AppState } from '../types'

// AI settings interface
export interface AISettings {
  // Empty interface to be filled later
}

// AI settings slice
export interface AISettingsSlice {
  ai: AISettings
  updateAISettings: (settings: Partial<AISettings>) => void
  resetAISettings: () => void
}

// Default AI settings
const DEFAULT_AI_SETTINGS: AISettings = {}

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
