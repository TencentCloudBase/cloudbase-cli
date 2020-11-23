import _ from 'lodash'
import { prompt } from 'enquirer'

import { Command, ICommand } from '../../common'
import { loadingFactory } from '../../../utils'
import { CloudBaseError } from '../../../error'
import { getFunctionDetail, sortLayer } from '../../../function'
import { InjectParams, CmdContext } from '../../../decorators'
import { layerCommonOptions } from './common'

@ICommand()
export class SortFileLayer extends Command {
    get options() {
        return {
            ...layerCommonOptions('sort <name>'),
            deprecateCmd: 'functions:layer:sort <name>',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                },
                {
                    flags: '--code-secret, <codeSecret>',
                    desc: '代码加密的函数的 CodeSecret'
                }
            ],
            desc: '重新排列云函数绑定的文件层的顺序'
        }
    }

    @InjectParams()
    async execute(@CmdContext() ctx) {
        const { envId, options, params } = ctx
        const { codeSecret } = options
        const fnName = params?.[0]

        const loading = loadingFactory()
        loading.start('数据加载中...')
        const detail = await getFunctionDetail({
            envId,
            codeSecret,
            functionName: fnName
        })
        loading.stop()

        const layers = detail.Layers.map((item) => ({
            name: `${item.LayerName} - ${item.LayerVersion}`,
            value: item
        }))

        if (!layers.length) {
            throw new CloudBaseError('没有可用的文件层，请先创建文件层！')
        }

        let { sortLayers } = await prompt<any>({
            type: 'sort',
            name: 'sortLayers',
            message: '选择文件层',
            numbered: true,
            choices: layers,
            result(choices) {
                return Object.values(this.map(choices)) as any
            }
        })

        sortLayers = sortLayers.map((item) => _.pick(item, ['LayerName', 'LayerVersion']))

        loading.start('文件层排序中...')
        await sortLayer({
            envId,
            functionName: fnName,
            layers: sortLayers
        })
        loading.succeed('文件层排序成功！')
    }
}
