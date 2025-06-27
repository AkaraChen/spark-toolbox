import { AISettingsSlice } from './slices/ai-settings'

// Complete application state interface that combines all slices
export type AppState = AISettingsSlice & {
  // Global actions
  resetAllSettings: () => void
}
