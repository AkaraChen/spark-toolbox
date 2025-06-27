import { DataField } from '@toolpad/core'
import { OneApiProvider } from '../entities'
import { Link } from '@mui/material'

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
