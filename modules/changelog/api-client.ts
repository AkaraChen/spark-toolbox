import type { ChangelogResult } from './types'
import { createClient } from '@/modules/universal/utils/fetch'

/**
 * Get changelog information for a package
 * @param packageName npm package name
 * @param githubToken Optional GitHub token for API access
 * @returns Changelog information
 */
export const getChangelogInfo = async (
    packageName: string,
    githubToken?: string
): Promise<ChangelogResult> => {
    const http = createClient(window.location.origin)
    return http.post(`/changelog/${packageName}`, {
        data: {
            githubToken,
        },
    })
}
