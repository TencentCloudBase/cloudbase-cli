import { prompt } from 'enquirer'
import {
    listLayers,
    listLayerVersions,
    attachLayer,
    getFunctionDetail,
    unAttachLayer,
    listFunction
} from '../../../function'
import { Command, ICommand } from '../../common'
import { loadingFactory } from '../../../utils'
import { CloudBaseError } from '../../../error'
import { InjectParams, EnvId, ArgsOptions, ArgsParams } from '../../../decorators'
import { layerCommonOptions } from './common'

const LayerStatusMap = {
    Active: '正常',
    Publishing: '发布中',
    PublishFailed: '发布失败',
    Deleted: '已删除'
}

@ICommand()
export class AttachFileLayer extends Command {
    get options() {
        return {
            ...layerCommonOptions('bind <name>'),
            deprecateCmd: 'functions:layer:bind <name>',
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
    async execute(@EnvId() envId, @ArgsParams() params, @ArgsOptions() options) {
        const { codeSecret } = options
        const fnName = params?.[0]

        const loading = loadingFactory()
        loading.start('数据加载中...')

        // 检查函数是否存在当前环境中
        const envFunctions = await listFunction({
            envId
        })
        const exist = envFunctions.find((fn) => fn.FunctionName === fnName)
        if (!exist) {
            throw new CloudBaseError(`当前环境不存在此函数 [${fnName}]`)
        }

        let layers: any[] = await listLayers({
            offset: 0,
            limit: 200
        })

        loading.stop()

        layers = layers.map((item) => ({
            name: `[${LayerStatusMap[item.Status] || '异常'}] ${item.LayerName}`,
            value: item.LayerName
        }))

        if (!layers.length) {
            throw new CloudBaseError('没有可用的文件层，请先创建文件层！')
        }

        const { layer } = await prompt<any>({
            type: 'select',
            name: 'layer',
            message: '选择文件层名称',
            choices: layers,
            result(choices) {
                const keys = Object.values(this.map(choices)) as string[]
                return keys[0]
            }
        })

        let versions = await listLayerVersions({
            name: layer
        })

        versions = versions.map((item) => String(item.LayerVersion))

        if (!versions.length) {
            throw new CloudBaseError('没有可用的文件层版本，请先创建文件层版本！')
        }

        const { version } = await prompt<any>({
            type: 'select',
            name: 'version',
            message: '选择文件层版本',
            choices: versions
        })

        loading.start('文件层绑定中...')
        await attachLayer({
            envId,
            functionName: fnName,
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
            ...layerCommonOptions('unbind <name>'),
            deprecateCmd: 'functions:layer:unbind <name>',
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
    async execute(@EnvId() envId, @ArgsParams() params, @ArgsOptions() options) {
        const { codeSecret } = options
        const fnName = params?.[0]

        const loading = loadingFactory()
        loading.start('数据加载中...')

        const detail = await getFunctionDetail({
            envId,
            codeSecret,
            functionName: fnName
        })

        if (!detail?.Layers?.length) {
            throw new CloudBaseError('该云函数未绑定文件层！')
        }

        loading.stop()

        const layers = detail.Layers.map((item) => ({
            name: `名称：${item.LayerName} / 版本： ${item.LayerVersion}`,
            value: item
        }))

        const { layer } = await prompt<any>({
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
            functionName: fnName,
            layerName: layer.LayerName,
            layerVersion: layer.LayerVersion,
            codeSecret
        })
        loading.succeed('文件层解绑成功！')
    }
}
