import path from 'path'
import fse from 'fs-extra'
import { prompt } from 'enquirer'
import { downloadLayer, listLayers, listLayerVersions } from '../../../function'
import { ICommandContext } from '../../command'
import { loadingFactory } from '../../../utils'
import { CloudBaseError } from '../../../error'

export async function downloadFileLayer(ctx: ICommandContext) {
    const { envId, options } = ctx
    const { dest } = options

    const loading = loadingFactory()
    loading.start('数据加载中...')

    let layers: any[] = await listLayers({
        offset: 0,
        limit: 200
    })

    loading.stop()

    // 只能下载当前环境的文件层
    layers = layers.filter(item => item.LayerName.includes(`_${envId}`)).map(item => item.LayerName)

    if (!layers.length) {
        throw new CloudBaseError('当前环境没有可用的文件层，请先创建文件层！')
    }

    const { layer } = await prompt({
        type: 'select',
        name: 'layer',
        message: '选择文件层名称',
        choices: layers
    })

    let versions = await listLayerVersions({
        name: layer
    })

    versions = versions.map(item => String(item.LayerVersion))

    const { version } = await prompt({
        type: 'select',
        name: 'version',
        message: '选择文件层版本',
        choices: versions
    })

    let destPath

    if (!dest) {
        destPath = path.resolve(process.cwd(), 'layers')
    }

    loading.start('文件下载中...')

    await fse.ensureDir(destPath)
    await downloadLayer({
        destPath,
        version: Number(version),
        name: layer,
        unzip: true
    })

    loading.succeed('文件下载成功！')
}
