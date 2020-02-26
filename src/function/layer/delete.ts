import fs from 'fs'
import path from 'path'
import { CloudBaseError } from '../../error'
import { CloudApiService } from '../../utils'

const scfService = new CloudApiService('scf')

export interface ILayerDeleteOptions {
    name: string
    version: number
}

// 创建文件层
export async function deleteLayer(options: ILayerDeleteOptions): Promise<void> {
    const { name, version } = options

    return scfService.request('DeleteLayerVersion', {
        LayerName: name,
        LayerVersion: version
    })
}
