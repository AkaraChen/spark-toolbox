import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { devtools } from 'zustand/middleware'
import { OPENAI, STORAGE } from '@/modules/universal/constants/store'

// App state interface
interface AppState {
    // OpenAI Base URL
    openaiBase: string
    setOpenaiBase: (url: string) => void

    // OpenAI API Key
    openaiKey: string
    setOpenaiKey: (key: string) => void

    // GitHub Token
    githubToken: string | null
    setGithubToken: (token: string) => void

    // Model selections
    largeModel: string
    setLargeModel: (model: string) => void

    baseModel: string
    setBaseModel: (model: string) => void

    smallModel: string
    setSmallModel: (model: string) => void

    // Language preferences
    primaryLanguage: string
    setPrimaryLanguage: (language: string) => void

    targetLanguage: string
    setTargetLanguage: (language: string) => void

    // Utility functions
    getModelByType: (type: 'large' | 'base' | 'small') => string

    // Reset actions
    resetSettings: () => void
    resetAuthSettings: () => void
}

// Create store with persistence
export const useStore = create<AppState>()(
    devtools(
        persist(
            (set, get) => ({
                // Initial state
                openaiBase: OPENAI.DEFAULT_BASE_URL,
                openaiKey: '',
                githubToken: null,
                largeModel: OPENAI.MODELS.LARGE,
                baseModel: OPENAI.MODELS.BASE,
                smallModel: OPENAI.MODELS.SMALL,
                primaryLanguage: 'English',
                targetLanguage: 'Chinese',
                // Actions
                setOpenaiBase: (url: string) =>
                    set(state => ({
                        openaiBase: url,
                    })),

                setOpenaiKey: (key: string) =>
                    set(state => ({
                        openaiKey: key,
                    })),

                setLargeModel: (model: string) =>
                    set({
                        largeModel: model,
                    }),

                setBaseModel: (model: string) =>
                    set({
                        baseModel: model,
                    }),

                setSmallModel: (model: string) =>
                    set({
                        smallModel: model,
                    }),

                setPrimaryLanguage: (language: string) =>
                    set({
                        primaryLanguage: language,
                    }),

                setTargetLanguage: (language: string) =>
                    set({
                        targetLanguage: language,
                    }),

                setGithubToken: (token: string) =>
                    set({
                        githubToken: token,
                    }),

                resetSettings: () =>
                    set({
                        openaiBase: OPENAI.DEFAULT_BASE_URL,
                        openaiKey: '',
                        largeModel: OPENAI.MODELS.LARGE,
                        baseModel: OPENAI.MODELS.BASE,
                        smallModel: OPENAI.MODELS.SMALL,
                    }),

                resetAuthSettings: () =>
                    set({
                        githubToken: null,
                    }),

                // Selector function inside the store
                getModelByType: type => {
                    const state = get()
                    switch (type) {
                        case 'large':
                            return state.largeModel
                        case 'base':
                            return state.baseModel
                        case 'small':
                            return state.smallModel
                        default:
                            return state.baseModel
                    }
                },
            }),
            {
                name: STORAGE.SETTING_STORE_NAME,
            },
        ),
    ),
)
