import path from 'path'
import { createLayer } from '../../../function'
import { ICommandContext } from '../../command'
import { loadingFactory } from '../../../utils'

export async function createFileLayer(ctx: ICommandContext, alias: string) {
    const { envId, options } = ctx
    const { file } = options

    const layerName = `${alias}_${envId}`
    const filePath = path.resolve(file)
    const runtimes = ['Nodejs8.9', 'Php7', 'Java8']

    const loading = loadingFactory()

    loading.start('文件层创建中...')

    await createLayer({
        layerName,
        runtimes,
        contentPath: filePath
    })

    loading.succeed('文件层创建成功！')
}
