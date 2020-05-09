import { Command } from '../common'
import { loadingFactory } from '../../utils'
import { deleteThirdPartAttach } from '../../third'
import { InjectParams, ArgsOptions } from '../../decorators'

export class DeleteThirdAttach extends Command {
    get options() {
        return {
            cmd: 'third:deleteThirdAttach',
            options: [
                {
                    flags: '--source <source>',
                    desc: '第三方来源'
                },
                {
                    flags: '--thirdAppId <thirdAppId>',
                    desc: '第三方appId'
                }
            ],
            desc: '解除第三方绑定',
            requiredEnvId: false
        }
    }

    @InjectParams()
    async execute(@ArgsOptions() options) {
        const { source, thirdAppId } = options

        let typeFlag
        if (source === 'qq') {
            typeFlag = 1
        }

        if (!typeFlag) {
            throw new Error('请指定对应的source')
        }

        const loading = loadingFactory()
        loading.start('数据加载中...')
        const data = await deleteThirdPartAttach({
            TypeFlag: typeFlag,
            ThirdPartAppid: thirdAppId
        })
        loading.stop()
        console.log(data)
    }
}
