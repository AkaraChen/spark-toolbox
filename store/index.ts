import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { devtools } from 'zustand/middleware'
import { AppState } from './types'
import { createAISettingsSlice, AISettingsSlice } from './slices/ai-settings'

// Create store with slices
export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (...a) => ({
        // Combine slices
        ...createAISettingsSlice(...a),
        
        // Global actions
        resetAllSettings: () => 
          a[0](() => ({
            // Reset all slices with proper default values
            ai: {
              openaiBase: 'https://api.openai.com/v1',
              openaiKey: '',
              largeModel: 'gpt-4',
              baseModel: 'gpt-3.5-turbo',
              smallModel: 'gpt-3.5-turbo-instruct'
            }
          }))
      }),
      {
        name: 'spark-store',
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
)

// Export type for convenience
export type { AISettingsSlice }

export default useAppStore
