import { OpenAI } from 'openai'
import * as llm from './llm'

/**
 * User preferences interface for translation
 */
interface UserPreferences {
    primaryLanguage: string
    targetLanguage: string
    largeModel: string
    smallModel: string
}

/**
 * Parameters for translation operations
 */
interface TranslateParams {
    text: string
    userPreferences: UserPreferences
    client: OpenAI
}

/**
 * Detect the language of the provided text
 * @param opts Translation parameters
 * @returns Detected language
 */
export async function detectLanguage(opts: TranslateParams): Promise<string> {
    const { text, userPreferences, client } = opts
    const preferences = [
        userPreferences.primaryLanguage,
        userPreferences.targetLanguage,
    ]
    return await llm.text(
        client,
        userPreferences.smallModel,
        `Detect the language of the following text: ${text}, 
        if the text is in ${userPreferences.primaryLanguage}, 
        return ${userPreferences.primaryLanguage}.
        Only return the language name,
        if the language is in [${preferences.join(', ')}], just return the specified language name. 
        if not in the list, return the language name in English,
        if you are not sure, return unknown.
        for example: ${userPreferences.primaryLanguage}`,
    )
}

/**
 * Translate text from source language to target language
 * @param text Text to translate
 * @param sourceLang Source language
 * @param targetLang Target language
 * @param opts Translation parameters
 * @returns Translated text
 */
async function translateToTargetLanguage(
    text: string,
    sourceLang: string,
    targetLang: string,
    opts: TranslateParams,
): Promise<string> {
    const { client } = opts
    return await llm.text(
        client,
        opts.userPreferences.largeModel,
        `Translate the following ${sourceLang} text to ${targetLang}: ${text}, 
        only output the translated text, 
        do not output any other text, for example: ${text}`,
    )
}

/**
 * Translate text based on source and target languages
 * If target language is not specified, it will translate:
 * - From primary language to target language if source is primary
 * - From any language to primary language if source is not primary
 * @param opts Translation parameters
 * @param sourceLanguage Source language
 * @param targetLanguage Target language (optional)
 * @returns Translated text
 */
export async function translate(
    opts: TranslateParams,
    sourceLanguage: string,
    targetLanguage?: string,
): Promise<string> {
    const { text, userPreferences } = opts
    if (targetLanguage) {
        return await translateToTargetLanguage(
            text,
            sourceLanguage,
            targetLanguage,
            opts,
        )
    }
    if (sourceLanguage === userPreferences.primaryLanguage) {
        // is mother language, try to translate to target language
        return await translateToTargetLanguage(
            text,
            sourceLanguage,
            userPreferences.targetLanguage,
            opts,
        )
    }
    // is not mother language, try to translate to mother language
    return await translateToTargetLanguage(
        text,
        sourceLanguage,
        userPreferences.primaryLanguage,
        opts,
    )
}
