import { prompt } from 'enquirer'
import { Command, ICommand } from '../common'
import { loadingFactory } from '../../utils'
import { InjectParams, EnvId } from '../../decorators'
import { switchHttpService, getHttpServicePrivilege, switchHttpServiceAuth } from '../../gateway'

@ICommand()
export class ServiceSwitchCommand extends Command {
    get options() {
        return {
            cmd: 'service:switch',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                }
            ],
            desc: '开启/关闭 HTTP Service 服务'
        }
    }

    @InjectParams()
    async execute(@EnvId() envId) {
        const loading = loadingFactory()
        loading.start('数据加载中...')

        const { EnableService } = await getHttpServicePrivilege({ envId })
        const status = EnableService ? '已开启' : '已关闭'

        loading.stop()

        const { enable } = await prompt({
            type: 'select',
            name: 'enable',
            message: `开启/关闭 HTTP Service 服务（当前状态：${status}）`,
            choices: ['开启', '关闭']
        })

        try {
            loading.start(`HTTP Service 服务${enable}中`)

            await switchHttpService({
                envId,
                enable: enable === '开启'
            })
            loading.succeed(`HTTP Service 服务${enable}成功！`)
        } catch (e) {
            loading.stop()
            throw e
        }
    }
}

@ICommand()
export class ServiceAuthSwitch extends Command {
    get options() {
        return {
            cmd: 'service:auth:switch',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                }
            ],
            desc: '开启/关闭 HTTP Service 服务访问鉴权'
        }
    }

    @InjectParams()
    async execute(@EnvId() envId) {
        const loading = loadingFactory()
        loading.start('数据加载中...')

        const { EnableAuth } = await getHttpServicePrivilege({ envId })
        const status = EnableAuth ? '已开启' : '已关闭'

        loading.stop()

        const { enable } = await prompt({
            type: 'select',
            name: 'enable',
            message: `开启/关闭 HTTP Service 服务访问鉴权（当前状态：${status}）`,
            choices: ['开启', '关闭']
        })

        try {
            loading.start(`HTTP Service 服务访问鉴权${enable}中`)

            await switchHttpServiceAuth({
                envId,
                enable: enable === '开启'
            })
            loading.succeed(`HTTP Service 服务访问鉴权${enable}成功！`)
        } catch (e) {
            loading.stop()
            throw e
        }
    }
}
