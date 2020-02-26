import _ from 'lodash'
import { prompt } from 'enquirer'
import { ICommandContext } from '../../command'
import { loadingFactory } from '../../../utils'
import { getFunctionDetail, sortLayer } from '../../../function'
import { CloudBaseError } from '../../../error'

export async function sortFileLayer(ctx: ICommandContext, name: string) {
    const { envId, options } = ctx
    const { codeSecret } = options

    const loading = loadingFactory()
    loading.start('数据加载中...')
    const detail = await getFunctionDetail({
        envId,
        codeSecret,
        functionName: name
    })
    loading.stop()

    const layers = detail.Layers.map(item => ({
        name: `${item.LayerName} - ${item.LayerVersion}`,
        value: item
    }))

    if (!layers.length) {
        throw new CloudBaseError('没有可用的文件层，请先创建文件层！')
    }

    let { sortLayers } = await prompt({
        type: 'sort',
        name: 'sortLayers',
        message: '选择文件层',
        numbered: true,
        choices: layers,
        result(choices) {
            return Object.values(this.map(choices)) as any
        }
    })

    sortLayers = sortLayers.map(item => _.pick(item, ['LayerName', 'LayerVersion']))

    loading.start('文件层排序中...')
    await sortLayer({
        envId,
        functionName: name,
        layers: sortLayers
    })
    loading.succeed('文件层排序成功！')
}
