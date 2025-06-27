import { DataModel } from '@toolpad/core'
import GLOBAL_STORE from './kv-store'

interface IStore<D extends DataModel> {
    get: (key: string) => D | null
    getAll: () => Record<string, D>
    set: (key: string, value: D) => void
    remove: (key: string) => void
    clear: () => void
    keys: () => string[]
}

export class LocalStorageStore<D extends DataModel> implements IStore<D> {
    constructor(private scope: string) {}
    get(key: string): D | null {
        return GLOBAL_STORE.get(this.scope, key)
    }
    getAll(): Record<string, D> {
        return GLOBAL_STORE.getAll(this.scope)
    }
    set(key: string, value: D): void {
        GLOBAL_STORE.set(this.scope, key, value)
    }
    remove(key: string): void {
        GLOBAL_STORE.remove(this.scope, key)
    }
    clear(): void {
        GLOBAL_STORE.clear(this.scope)
    }
    keys(): string[] {
        return GLOBAL_STORE.keys(this.scope)
    }
}
