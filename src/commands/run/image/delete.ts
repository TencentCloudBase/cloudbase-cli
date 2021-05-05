import { Command, ICommand } from '../../common'
import { CloudBaseError } from '../../../error'
import { deleteImage, listImage } from '../../../run'
import { loadingFactory, pagingSelectPromp } from '../../../utils'
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
                }
            ],
            desc: '删除云开发环境下云托管服务的版本'
        }
    }

    @InjectParams()
    async execute(@EnvId() envId, @ArgsOptions() options) {

        let { serviceName = '' } = options

        if (serviceName.length === 0) {
            throw new CloudBaseError('必须输入 serviceName')
        }

        const loading = loadingFactory()

        // loading.start('数据加载中...')

        const imageUrl = await pagingSelectPromp(
            'select',
            listImage,
            { envId, serviceName, limit: 0, offset: 0 },
            '请选择要删除的镜像',
            item => item.ReferVersions.length === 0,
            item => item.ImageUrl
        )

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