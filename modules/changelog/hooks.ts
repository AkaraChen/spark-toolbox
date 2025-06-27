import { useMutation } from '@tanstack/react-query'
import { getChangelogInfo } from './api/client'
import { ChangelogResult } from './api/types'
import { useNotification } from '../universal/hooks/use-notification'
import { useStore } from '@/modules/universal/store/app-state'

/**
 * Hook for fetching changelog information for a package
 * @returns Mutation object for fetching changelog information
 */
export function useChangelogInfo() {
    const { showError } = useNotification()
    const { githubToken } = useStore()

    return useMutation<ChangelogResult, Error, string>({
        mutationFn: (packageName: string) => {
            if (!packageName.trim()) {
                showError('Please enter a package name')
                return Promise.reject(new Error('Please enter a package name'))
            }
            return getChangelogInfo(packageName, githubToken || undefined)
        },
        onError: error => {
            showError(
                error instanceof Error
                    ? error.message
                    : 'Failed to fetch changelog information',
            )
        },
    })
}
