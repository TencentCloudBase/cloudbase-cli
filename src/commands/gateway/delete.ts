import { prompt } from 'enquirer'
import { deleteGateway, queryGateway } from '../../gateway'
import { loadingFactory } from '../../utils'
import { ICommandContext } from '../command'

export async function deleteService(ctx: ICommandContext) {
    const { envId, options } = ctx

    let { servicePath, serviceId, name } = options

    // 当没有指定要删除的服务时，获取所有服务列表，并提示
    if (!servicePath && !serviceId && (!name || typeof name !== 'string')) {
        const { APISet: allServices } = await queryGateway({
            envId
        })

        const { selected } = await prompt({
            type: 'select',
            name: 'selected',
            message: '请选择需要删除的 Service',
            choices: allServices.map(item => ({
                name: `函数名：${item.Name}/路径：${item.Path}`,
                value: item.APIId
            })),
            result(choices) {
                return Object.values(this.map(choices)) as any
            }
        })
        serviceId = selected?.[0]
    }

    const loading = loadingFactory()
    loading.start('HTTP Service 删除中...')

    try {
        await deleteGateway({
            envId,
            name,
            path: servicePath,
            gatewayId: serviceId
        })
        loading.succeed('HTTP Service 删除成功！')
    } catch (e) {
        loading.stop()
        throw e
    }
}
