import { LocalStorageStore } from './local-storage'
import { DataModel, DataModelId } from '@toolpad/core'
import { nanoid } from 'nanoid'

export function createCrud<T extends DataModel>(store: LocalStorageStore<T>) {
    return {
        getMany() {
            const items = Object.values(store.getAll())
            return {
                items,
                itemCount: items.length,
            }
        },
        getOne(id: DataModelId) {
            const item = store.get(id.toString())
            if (!item) {
                throw new Error('Item not found')
            }
            return item
        },
        createOne(data: Omit<T, 'id'>) {
            const id = nanoid()
            const item = {
                id,
                ...data,
            } as T
            store.set(id, item)
            return item
        },
        updateOne(id: DataModelId, data: Partial<T>) {
            const updated = {
                id,
                ...data,
            } as T
            store.set(id.toString(), updated)
            return updated
        },
        deleteOne(id: DataModelId) {
            store.remove(id.toString())
        },
    }
}
