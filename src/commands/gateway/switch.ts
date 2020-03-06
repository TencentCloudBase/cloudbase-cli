import { prompt } from 'enquirer'
import { switchHttpService, getHttpServicePrivilege, switchHttpServiceAuth } from '../../gateway'
import { loadingFactory } from '../../utils'
import { ICommandContext } from '../command'

export async function serviceSwitch(ctx: ICommandContext) {
    const { envId } = ctx

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

export async function serviceAuthSwitch(ctx: ICommandContext) {
    const { envId } = ctx

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
