import _ from 'lodash'
import { getFunctionDetail } from '../base'
import { CloudApiService } from '../../utils'
import { CloudBaseError } from '../../error'

const scfService = new CloudApiService('scf')

export interface IAttachOptions {
    envId: string
    layerName: string
    layerVersion: number
    functionName: string
    codeSecret?: string
}

// 函数绑定文件层
export async function attachLayer(options: IAttachOptions): Promise<void> {
    const { envId, functionName, layerName, layerVersion, codeSecret } = options

    let { Layers } = await getFunctionDetail({
        envId,
        codeSecret,
        functionName
    })

    Layers = Layers.map(item => _.pick(item, ['LayerName', 'LayerVersion']))
    // 新加的文件层添加到最后
    Layers.push({
        LayerName: layerName,
        LayerVersion: layerVersion
    })
    const res = await scfService.request('UpdateFunctionConfiguration', {
        Layers,
        Namespace: envId,
        FunctionName: functionName
    })
    return res
}

// 函数解绑文件层
export async function unAttachLayer(options: IAttachOptions): Promise<void> {
    const { envId, functionName, layerName, layerVersion, codeSecret } = options

    let { Layers } = await getFunctionDetail({
        envId,
        codeSecret,
        functionName
    })

    Layers = Layers.map(item => _.pick(item, ['LayerName', 'LayerVersion']))

    const index = Layers.findIndex(
        item => item.LayerName === layerName && item.LayerVersion === layerVersion
    )

    if (index === -1) {
        throw new CloudBaseError('层不存在')
    }

    // 删除指定的层
    Layers.splice(index, 1)

    return scfService.request('UpdateFunctionConfiguration', {
        Layers,
        Namespace: envId,
        FunctionName: functionName
    })
}
