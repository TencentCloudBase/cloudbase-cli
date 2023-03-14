import { Command, ICommand } from '../../common'
import { listPackageStandalonegateway } from '../../../run'
import { loadingFactory } from '@cloudbase/toolbox'
import { EnvId, ArgsOptions, ArgsParams, InjectParams } from '../../../decorators'
import { standalonegatewayCommonOptions } from './common'
import { CloudBaseError } from '../../../error'
import { printHorizontalTable } from '../../../utils'

@ICommand()
export class PackageStandalonegateway extends Command {
    get options() {
        return {
            ...standalonegatewayCommonOptions('package <operation>'),
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                },
                {
                    flags: '-p, --packageVersion <packageVersion>',
                    desc: '套餐版本'
                }
            ],
            desc: '套餐操作'
        }
    }

    @InjectParams()
    async execute(@EnvId() envId, @ArgsParams() params, @ArgsOptions() options) {
        const operation = params?.[0]
        if (!operation || ['list'].indexOf(operation) === -1) {
            throw new CloudBaseError('请输入具体操作')
        }

        switch (operation) {
            case 'list':
                {
                    let { appId, packageVersion = '' } = options
                    appId = String(appId)
                    packageVersion = String(packageVersion)

                    const loading = loadingFactory()

                    loading.start('数据加载中...')

                    const data = await listPackageStandalonegateway({
                        envId,
                        packageVersion
                    })

                    loading.stop()

                    const head = ['CPU', '内存', '版本']

                    printHorizontalTable(head, data)
                }
                break
            default:
                break
        }
    }
}
