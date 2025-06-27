/**
 * Language constants and utilities for translation
 */

export const auto = Symbol('auto')
export type Lang = typeof auto | string

/**
 * List of supported languages
 */
export const langs = [
    'Chinese',
    'English',
    'French',
    'German',
    'Italian',
    'Japanese',
    'Korean',
    'Portuguese',
    'Russian',
    'Spanish',
    'Vietnamese',
]
