import { CloudApiService } from '../../utils'

const scfService = new CloudApiService('scf')

export interface ILayer {
    LayerName: string
    LayerVersion: number
}

export interface ISortOptions {
    envId: string
    functionName: string
    layers: ILayer[]
}

// 函数文件层排序
export async function sortLayer(options: ISortOptions): Promise<void> {
    const { envId, functionName, layers } = options
    return scfService.request('UpdateFunctionConfiguration', {
        Layers: layers,
        Namespace: envId,
        FunctionName: functionName
    })
}
