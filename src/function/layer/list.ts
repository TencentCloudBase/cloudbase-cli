import { CloudApiService } from '../../utils'

const scfService = new CloudApiService('scf')

export interface ILayerListOptions {
    offset: number
    limit: number
}

export interface IVersionListOptions {
    name: string
}

// 列出文件层
export async function listLayers(options: ILayerListOptions): Promise<any> {
    const { offset, limit } = options

    const res = await scfService.request('ListLayers', {
        Offset: offset,
        Limit: limit
    })
    return res?.Layers || []
}

// 获取文件层的版本列表
export async function listLayerVersions(options: IVersionListOptions): Promise<any> {
    const { name } = options
    const res = await scfService.request('ListLayerVersions', {
        LayerName: name
    })
    return res?.LayerVersions || []
}
