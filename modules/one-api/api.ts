import type { Status, User } from './types'
import { createClient } from '@/modules/universal/utils/fetch'

export async function getProviderQuota(
    baseURL: string,
    token: string,
    userId?: number,
) {
    const client = createClient(baseURL)
    const { data: status } = (await client.get('/api/status', {
        token,
    })) as Status
    const quotaPerUnit = status.quota_per_unit
    const { data: user } = (await client.get('/api/user/self', {
        token,
        headers: {
            ...(userId ? { 'New-Api-User': userId.toString() } : {}),
        },
    })) as User
    const quota = user.quota
    const unitCount = quota / quotaPerUnit
    return {
        quotaPerUnit,
        quota,
        unitCount,
    }
}
