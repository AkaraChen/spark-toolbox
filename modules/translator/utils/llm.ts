import { OpenAI } from 'openai'

/**
 * Generate text using OpenAI's completion API
 * @param client OpenAI client instance
 * @param model Model to use for text generation
 * @param prompt Prompt for text generation
 * @returns Generated text
 */
export async function text(
    client: OpenAI,
    model: string,
    prompt: string
): Promise<string> {
    try {
        const response = await client.chat.completions.create({
            model,
            messages: [
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            temperature: 0.3,
            max_tokens: 1000,
        })

        return response.choices[0]?.message?.content?.trim() || ''
    } catch (error) {
        console.error('Error generating text:', error)
        throw error
    }
}
