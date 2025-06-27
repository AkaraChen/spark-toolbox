import { Entity } from '@/modules/universal/types/entity'
import { LocalStorageStore } from '@/modules/universal/utils/local-storage'
import { DataModel, DataSourceCache } from '@toolpad/core'
import { z } from 'zod'
import { createCrud } from '@/modules/universal/utils/crud'
import { QuotaColumn, URLColumn } from './components'

export interface OneApiProvider extends DataModel {
    id: string
    name: string
    apiKey: string
    apiBase: string
    userId?: number
    unit: 'USD' | 'RMB'
}

const store = new LocalStorageStore<OneApiProvider>('one-api-providers')
const crud = createCrud(store)

export const oneApiProviderEntity: Entity<OneApiProvider> = {
    dataSource: {
        fields: [
            {
                field: 'name',
                headerName: 'Name',
            },
            {
                field: 'apiKey',
                headerName: 'API Key',
            },
            {
                field: 'apiBase',
                headerName: 'URL',
                renderCell: URLColumn,
            },
            {
                field: 'userId',
                headerName: 'User ID',
                type: 'number',
            },
            {
                field: 'unit',
                type: 'singleSelect',
                valueOptions: [
                    {
                        value: 'USD',
                        label: 'USD',
                    },
                    {
                        value: 'RMB',
                        label: 'RMB',
                    },
                ],
                headerName: 'Unit',
            },
            {
                field: 'quota',
                headerName: 'Quota',
                renderCell: QuotaColumn,
                display: 'flex',
            },
        ],
        ...crud,
        validate: z.object({
            name: z.string().min(1, 'Name is required'),
            apiKey: z.string().min(1, 'API Key is required'),
            apiBase: z
                .string()
                .url('Must be a valid URL')
                .min(1, 'API Base URL is required'),
            userId: z.number().int().optional(),
            unit: z.enum(['USD', 'RMB']),
        })['~standard'].validate,
    },
    cache: new DataSourceCache(),
}
