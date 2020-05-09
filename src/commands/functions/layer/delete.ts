import { prompt } from 'enquirer'
import { Command, ICommand } from '../../common'
import { loadingFactory } from '../../../utils'
import { CloudBaseError } from '../../../error'
import { InjectParams, EnvId } from '../../../decorators'
import { deleteLayer, listLayers, listLayerVersions } from '../../../function'

@ICommand()
export class DeleteFileLayer extends Command {
    get options() {
        return {
            cmd: 'functions:layer:delete',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                }
            ],
            desc: '删除当前环境的文件层'
        }
    }

    @InjectParams()
    async execute(@EnvId() envId) {
        const loading = loadingFactory()
        loading.start('数据加载中...')

        let layers: any[] = await listLayers({
            offset: 0,
            limit: 200
        })

        loading.stop()

        // 只能删除当前环境的文件层
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

        loading.start('文件层删除中...')
        await deleteLayer({
            name: layer,
            version: Number(version)
        })
        loading.succeed('文件层删除成功！')
    }
}
