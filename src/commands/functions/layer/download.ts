import path from 'path'
import fse from 'fs-extra'
import { prompt } from 'enquirer'
import { loadingFactory } from '../../../utils'
import { CloudBaseError } from '../../../error'
import { Command, ICommand } from '../../common'
import { InjectParams, EnvId, ArgsOptions } from '../../../decorators'
import { downloadLayer, listLayers, listLayerVersions } from '../../../function'

@ICommand()
export class DownloadFileLayer extends Command {
    get options() {
        return {
            cmd: 'functions:layer:download',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                },
                {
                    flags: '--dest <dest>',
                    desc: '下载文件存放的地址'
                }
            ],
            desc: '下载云函数文件层'
        }
    }

    @InjectParams()
    async execute(@EnvId() envId, @ArgsOptions() options) {
        const { dest } = options

        const loading = loadingFactory()
        loading.start('数据加载中...')

        let layers: any[] = await listLayers({
            offset: 0,
            limit: 200
        })

        loading.stop()

        // 只能下载当前环境的文件层
        layers = layers
            .filter((item) => item.LayerName.includes(`_${envId}`))
            .map((item) => item.LayerName)

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

        versions = versions.map((item) => String(item.LayerVersion))

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
}
