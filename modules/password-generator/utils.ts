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

/**
 * Parse command line arguments into password flags
 * @param arg Command line argument string (e.g., "12snul")
 * @returns Parsed password flags
 */
export function parseArguments(arg: string): PasswordFlags {
    const flags: PasswordFlags = {
        length: 12,
        symbol: false,
        number: false,
        upperCase: false,
        lowerCase: false,
    }

    let lengthStr = ''

    for (const char of arg) {
        switch (char) {
            case 's':
                flags.symbol = true
                break
            case 'n':
                flags.number = true
                break
            case 'u':
                flags.upperCase = true
                break
            case 'l':
                flags.lowerCase = true
                break
            default:
                // If it's a digit, add it to the length string
                if (/\d/.test(char)) {
                    lengthStr += char
                }
        }
    }

    if (lengthStr) {
        flags.length = parseInt(lengthStr, 10)
    }

    return flags
}
