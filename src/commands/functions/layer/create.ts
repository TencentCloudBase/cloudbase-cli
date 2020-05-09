import path from 'path'
import { Command, ICommand } from '../../common'
import { createLayer } from '../../../function'
import { loadingFactory } from '../../../utils'
import { InjectParams, EnvId, ArgsOptions, ArgsParams } from '../../../decorators'

@ICommand()
export class CreateFileLayer extends Command {
    get options() {
        return {
            cmd: 'functions:layer:create <alias>',
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
}
