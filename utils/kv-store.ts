import { STORE_PATH } from '@/constants'
import { DataModel } from '@toolpad/core'

export interface IKvStore {
    get: <T>(scope: string, key: string) => T | null
    getAll: <T>(scope: string) => Record<string, T>
    set: <T>(scope: string, key: string, value: T) => void
    remove: (scope: string, key: string) => void
    clear: (scope: string) => void
    keys: (scope: string) => string[]
}

export class KvStore implements IKvStore {
    constructor(private key: string) {}
    read(): Record<string, Record<string, DataModel>> {
        const item = localStorage.getItem(this.key)
        if (!item) {
            return {}
        }
        return JSON.parse(item)
    }
    get<T extends unknown>(scope: string, key: string): T | null {
        const items = this.read()
        return (items[scope][key] as T) || null
    }
    getAll<T extends unknown>(scope: string): Record<string, T> {
        const items = this.read()
        return (items[scope] as Record<string, T>) || {}
    }
    set<T extends unknown>(scope: string, key: string, value: T): void {
        const items = this.read()
        if (!items[scope]) {
            items[scope] = {}
        }
        items[scope][key] = value as DataModel
        localStorage.setItem(this.key, JSON.stringify(items))
    }
    remove(scope: string, key: string): void {
        const items = this.read()
        delete items[scope][key]
        localStorage.setItem(this.key, JSON.stringify(items))
    }
    clear(scope: string): void {
        const items = this.read()
        delete items[scope]
        localStorage.setItem(this.key, JSON.stringify(items))
    }
    keys(scope: string): string[] {
        const items = this.read()
        return Object.keys(items[scope])
    }
}

const GLOBAL_STORE = new KvStore(STORE_PATH)

export default GLOBAL_STORE
