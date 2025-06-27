import { useMutation } from '@tanstack/react-query'
import { getChangelogInfo } from './api-client'
import { ChangelogResult } from './types'
import { useNotification } from '../universal/hooks/use-notification'

/**
 * Hook for fetching changelog information for a package
 * @returns Mutation object for fetching changelog information
 */
export function useChangelogInfo() {
    const { showError } = useNotification()
    
    return useMutation<ChangelogResult, Error, string>({
        mutationFn: (packageName: string) => {
            if (!packageName.trim()) {
                showError('Please enter a package name')
                return Promise.reject(new Error('Please enter a package name'))
            }
            return getChangelogInfo(packageName)
        },
        onError: (error) => {
            showError(error instanceof Error ? error.message : 'Failed to fetch changelog information')
        }
    })
}
