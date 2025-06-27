import type { Quota } from '@/app/one-api/quota/route'
import { createClient } from '@/modules/universal/utils/fetch'

export const getProviderQuota = async (
    baseURL: string,
    token: string,
    userId?: number,
): Promise<Quota> => {
    const http = createClient(window.location.origin)
    return http.post('/one-api/quota', {
        data: {
            baseURL,
            token,
            userId,
        },
    })
}
