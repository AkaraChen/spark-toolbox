import { DataField } from '@toolpad/core'
import { OneApiProvider } from './entity'
import { useQuery } from '@tanstack/react-query'
import { getProviderQuota } from './api-client'
import { CircularProgress, Link } from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'

export const QuotaColumn: DataField['renderCell'] = params => {
    const { row } = params
    const provider = row as OneApiProvider
    const queryClient = useQueryClient()
    const query = useQuery({
        queryKey: ['one-api', provider.id],
        queryFn: () =>
            getProviderQuota(
                provider.apiBase,
                provider.apiKey,
                provider.userId,
            ),
    })
    if (query.isPending) {
        return <CircularProgress size={20} />
    }
    if (query.isError) {
        return <span>{query.error.message}</span>
    }
    return (
        <div
            onClick={e => {
                e.stopPropagation()
                queryClient.resetQueries({
                    queryKey: ['one-api', provider.id],
                })
            }}
        >
            {query.data?.unitCount.toFixed(2)} {provider.unit}
        </div>
    )
}

export const URLColumn: DataField['renderCell'] = params => {
    const { row } = params
    const provider = row as OneApiProvider
    return (
        <Link
            onClick={e => {
                e.stopPropagation()
                window.open(provider.apiBase, '_blank')
            }}
        >
            {provider.apiBase}
        </Link>
    )
}
