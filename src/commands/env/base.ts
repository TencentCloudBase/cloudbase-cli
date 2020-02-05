import { listEnvs, updateEnvInfo } from '../../env'
import { printHorizontalTable, loadingFactory } from '../../utils'
import { CloudBaseError } from '../../error'
import { warnLog, successLog } from '../../logger'
import { ICommandContext } from '../command'

export async function list() {
    const loading = loadingFactory()
    loading.start('数据加载中...')
    const data = await listEnvs()
    loading.stop()
    const head = ['名称', '环境 Id', '套餐版本', '来源', '创建时间', '环境状态']

    const sortData = data.sort((prev, next) => {
        if (prev.Alias > next.Alias) {
            return 1
        }
        if (prev.Alias < next.Alias) {
            return -1
        }
        return 0
    })

    const tableData = sortData.map(item => [
        item.Alias,
        item.EnvId,
        item.PackageName || '空',
        item.Source === 'miniapp' ? '小程序' : '云开发',
        item.CreateTime,
        item.Status === 'NORMAL' ? '正常' : '不可用'
    ])

    printHorizontalTable(head, tableData)
    // 不可用环境警告
    const unavailableEnv = data.find(item => item.Status === 'UNAVAILABLE')
    if (unavailableEnv) {
        warnLog(`您的环境中存在不可用的环境：[${unavailableEnv.EnvId}]，请留意！`)
    }
}

export async function rename(ctx: ICommandContext, name: string) {
    if (!name) {
        throw new CloudBaseError('环境名称不能为空！')
    }

    await updateEnvInfo({
        envId: ctx.envId,
        alias: name
    })

    successLog('更新环境名成功 ！')
}
