import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface Settings {
}

interface AppState {
  settings: Settings
  updateSettings: (settings: Partial<Settings>) => void
  resetSettings: () => void
}

const DEFAULT_SETTINGS: Settings = {}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      settings: DEFAULT_SETTINGS,
      
      updateSettings: (newSettings) => 
        set((state) => ({
          settings: {
            ...state.settings,
            ...newSettings
          }
        })),
      
      resetSettings: () => 
        set(() => ({
          settings: DEFAULT_SETTINGS
        }))
    }),
    {
      name: 'spark-settings',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

export default useAppStore
