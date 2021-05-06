import { Command, ICommand } from '../../common'
import { CloudBaseError } from '../../../error'
import { deleteImage, describeImageRepo } from '../../../run'
import { loadingFactory } from '../../../utils'
import { InjectParams, EnvId, ArgsOptions } from '../../../decorators'
import { imageCommonOptions } from './common'

@ICommand()
export class DeleteImage extends Command {
    get options() {
        return {
            ...imageCommonOptions('delete'),
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                },
                {
                    flags: '-s, --serviceName <serviceName>',
                    desc: '托管服务 name'
                },
                {
                    flags: '-t, --imageTag <imageTag>',
                    desc: '镜像 tag'
                }
            ],
            desc: '删除云开发环境下云托管服务的版本'
        }
    }

    @InjectParams()
    async execute(@EnvId() envId, @ArgsOptions() options) {

        let { serviceName = '', imageTag = '' } = options

        if (serviceName.length === 0 || imageTag.length === 0) {
            throw new CloudBaseError('必须输入 serviceName 和 imageTag')
        }

        const loading = loadingFactory()

        loading.start('数据加载中...')

        const imageRepo = await describeImageRepo({ envId, serverName: serviceName })

        const imageUrl = `ccr.ccs.tencentyun.com/${imageRepo}:${imageTag}`

        try {
            const res = await deleteImage({
                envId,
                imageUrl: imageUrl as string
            })

            if (res === 'success') loading.succeed(`成功删除 ${serviceName} 服务下的 ${imageUrl} 镜像`)
            else throw new CloudBaseError('删除失败')
        } catch (e) {
            throw new CloudBaseError('删除失败')
        }

    }
}