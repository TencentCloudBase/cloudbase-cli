import { CloudApiService, getMangerService } from '../utils/net'

const lowCodeService = new CloudApiService('lowcode', {}, '2021-01-08')

// 查询模型列表
export async function listModels(options: { envId?: string, name?: string[] } = {}): Promise<any[]> {
    const { envId } = options

    const datasourceList: any = await lowCodeService.request('DescribeDataSourceList', {
        EnvId: envId,
        PageIndex: 1,
        PageSize: 1000,
        DataSourceNames: options.name,
        QuerySystemModel: true, // 查询系统模型
        QueryConnector: 0 // 0 表示数据模型
    })

    const rows = datasourceList.Data.Rows

    return rows
}

// 创建模型
export async function createModel({ envId, name, title, schema }: { envId: string, name: string, title: string, schema: any }) {
    return ((await lowCodeService.request('CreateDataSourceDetail', {
        EnvId: envId,
        Title: title,
        Name: name,
        Type: 'database',
        TableNameRule: "only_name",
        Schema: JSON.stringify(schema)
    }) as any).Data)
}

// 更新模型
export async function updateModel({ envId, id, title, schema }: { envId: string, id: string, title: string, schema: any }) {
    return ((await lowCodeService.request('ModifyDataSource', {
        Id: id,
        EnvId: envId,
        Title: title,
        Schema: JSON.stringify(schema)
    }) as any).Data)
}

// 查询模型
export async function getModel(options: { envId: string, name: string }): Promise<any> {
    const { envId, name } = options

    try {
        return (await lowCodeService.request('DescribeDataSource', {
            EnvId: envId,
            Name: name
        })).Data
    } catch (e) {
        if (e.original.Code === 'ResourceNotFound') {
            return null
        } else {
            throw e
        }
    }
}

// 发布模型
export async function publishModel(options: { envId: string, ids: string[] }): Promise<any> {
    const { envId, ids } = options
    return ((await lowCodeService.request('BatchPublishDataSources', {
        EnvId: envId,
        DataSourceIds: ids
    })) as any).Data
}