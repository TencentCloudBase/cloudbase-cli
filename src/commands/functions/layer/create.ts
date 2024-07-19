import path from 'path'
import { Command, ICommand } from '../../common'
import { createLayer, listLayers } from '../../../function'
import { loadingFactory } from '../../../utils'
import { InjectParams, EnvId, ArgsOptions, ArgsParams } from '../../../decorators'
import { layerCommonOptions } from './common'
import { CloudBaseError } from '@cloudbase/toolbox'

@ICommand()
export class CreateFileLayer extends Command {
    get options() {
        return {
            ...layerCommonOptions('create <alias>'),
            deprecateCmd: 'functions:layer:create <alias>',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                },
                {
                    flags: '--file, <file>',
                    desc: '文件路径'
                }
            ],
            desc: '创建函数文件层'
        }
    }

    @InjectParams()
    async execute(@EnvId() envId, @ArgsOptions() options, @ArgsParams() params) {
        const alias = params?.[0]
        const { file } = options

        const layerName = `${alias}_${envId}`

        const layers: any[] = await listLayers({
            offset: 0,
            limit: 200
        })
        if (layers.find(({ LayerName }) => LayerName === layerName)) {
            throw new CloudBaseError(
                `层名称 ${layerName} 已被您的当前环境或其他环境占用，请换用别的名称`
            )
        }

        const filePath = path.resolve(file)
        const runtimes = ['Nodejs12.16', 'Nodejs8.9', 'Php7', 'Java8']

        const loading = loadingFactory()

        loading.start('文件层创建中...')

        await createLayer({
            envId,
            layerName,
            runtimes,
            contentPath: filePath
        })

        loading.succeed('文件层创建成功！')
    }
}
