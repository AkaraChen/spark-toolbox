import { randomInt, pick } from '@akrc/std/random'

/**
 * Password generator flags
 */
export interface PasswordFlags {
    /** Password length */
    length: number
    /** Include symbols */
    symbol: boolean
    /** Include numbers */
    number: boolean
    /** Include uppercase letters */
    upperCase: boolean
    /** Include lowercase letters */
    lowerCase: boolean
}

/**
 * Generate a password based on provided flags
 * @param flags Password generation options
 * @returns Generated password
 */
export function generatePassword(flags: PasswordFlags): string {
    const { symbol, number, upperCase, lowerCase } = flags
    const length = flags.length || 12
    let result = ''

    for (let i = 0; i < length; i++) {
        let char = ''

        if (symbol) {
            char += String.fromCharCode(randomInt(33, 48))
        }

        if (number) {
            char += String.fromCharCode(randomInt(48, 58))
        }

        if (upperCase) {
            char += String.fromCharCode(randomInt(65, 91))
        }

        if (lowerCase) {
            char += String.fromCharCode(randomInt(97, 123))
        }

        // Default to random case letters if no character type is selected
        if (!char) {
            char += String.fromCharCode(
                Math.random() < 0.5 ? randomInt(65, 91) : randomInt(97, 123),
            )
        }

        result += pick(char.split(''))
    }

    return result
}
