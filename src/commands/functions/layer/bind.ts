import { prompt } from 'enquirer'
import {
    listLayers,
    listLayerVersions,
    attachLayer,
    getFunctionDetail,
    unAttachLayer
} from '../../../function'
import { Command, ICommand } from '../../common'
import { loadingFactory } from '../../../utils'
import { CloudBaseError } from '../../../error'
import { InjectParams, EnvId, ArgsOptions } from '../../../decorators'

@ICommand()
export class AttachFileLayer extends Command {
    get options() {
        return {
            cmd: 'functions:layer:bind <name>',
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
            desc: '绑定文件层到云函数'
        }
    }

    @InjectParams()
    async execute(@EnvId() envId, @ArgsOptions() options) {
        const { codeSecret } = options

        const loading = loadingFactory()
        loading.start('数据加载中...')
        let layers: any[] = await listLayers({
            offset: 0,
            limit: 200
        })
        loading.stop()

        layers = layers.map((item) => item.LayerName)

        if (!layers.length) {
            throw new CloudBaseError('没有可用的文件层，请先创建文件层！')
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

        versions = versions.map((item) => String(item.LayerVersion))

        if (!versions.length) {
            throw new CloudBaseError('没有可用的文件层版本，请先创建文件层版本！')
        }

        const { version } = await prompt({
            type: 'select',
            name: 'version',
            message: '选择文件层版本',
            choices: versions
        })

        loading.start('文件层绑定中...')
        await attachLayer({
            envId,
            functionName: name,
            layerName: layer,
            layerVersion: Number(version),
            codeSecret
        })
        loading.succeed('文件层绑定成功！')
    }
}

@ICommand()
export class UnAttachFileLayer extends Command {
    get options() {
        return {
            cmd: 'functions:layer:unbind <name>',
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
            desc: '删除云函数绑定的文件层'
        }
    }

    @InjectParams()
    async execute(@EnvId() envId, @ArgsOptions() options) {
        const { codeSecret } = options

        const loading = loadingFactory()
        loading.start('数据加载中...')

        const detail = await getFunctionDetail({
            envId,
            codeSecret,
            functionName: name
        })

        if (!detail?.Layers?.length) {
            throw new CloudBaseError('该云函数未绑定文件层！')
        }

        loading.stop()

        const layers = detail.Layers.map((item) => ({
            name: `名称：${item.LayerName} / 版本： ${item.LayerVersion}`,
            value: item
        }))

        const { layer } = await prompt({
            type: 'select',
            name: 'layer',
            message: '选择文件层',
            choices: layers,
            result(choice) {
                return this.map(choice)[choice]
            }
        })

        loading.start('文件层解绑中...')
        await unAttachLayer({
            envId,
            functionName: name,
            layerName: layer.LayerName,
            layerVersion: layer.LayerVersion,
            codeSecret
        })
        loading.succeed('文件层解绑成功！')
    }
}
