import { DataModel, DataSource, DataSourceCache } from '@toolpad/core'

export interface Entity<D extends DataModel> {
    dataSource: DataSource<D>
    cache: DataSourceCache
}
