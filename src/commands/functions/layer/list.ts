import { ICommandContext } from '../../command'
import { listLayers, getFunctionDetail, listLayerVersions } from '../../../function'
import { loadingFactory, printHorizontalTable } from '../../../utils'

/**
 * 展示文件层列表
 * 1. 当不传入函数名时，展示所有文件层
 * 2. 当传入函数名时，展示函数绑定的文件层
 * 3. 当传入文件层别名时，展示文件层的版本信息
 */
export async function listFileLayer(ctx: ICommandContext) {
    const { envId, options } = ctx
    const { name, layer, codeSecret } = options

    const loading = loadingFactory()
    loading.start('数据加载中...')

    let data

    // 展示文件层的版本信息
    if (layer && typeof layer === 'string') {
        const layerName = `${layer}_${envId}`
        data = await listLayerVersions({
            name: layerName
        })
    } else if (name && typeof name === 'string') {
        // 展示函数绑定的文件层
        const res = await getFunctionDetail({
            envId,
            functionName: name,
            codeSecret
        })
        data = res?.Layers || []
    } else {
        // 展示所有文件层
        data = await listLayers({
            offset: 0,
            limit: 200
        })
    }

    loading.stop()

    const head = ['优先级', '名称', '状态', '版本', '证书', '支持运行时', '创建时间']
    const tableData = data.map((item, index) => [
        index + 1,
        item.LayerName,
        item.Status,
        item.LayerVersion,
        item.LicenseInfo || '空',
        item.CompatibleRuntimes.join(' | '),
        item.AddTime
    ])
    printHorizontalTable(head, tableData)
    console.log('Tips：函数绑定多个版本时，同名文件将按优先级从小到大的顺序进行覆盖执行。')
}
