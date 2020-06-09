import { Command, ICommand } from '../common'
import { CloudBaseError } from '../../error'
import { listEnvs, updateEnvInfo } from '../../env'
import { InjectParams, EnvId, ArgsParams, Log, Logger } from '../../decorators'
import { printHorizontalTable, loadingFactory } from '../../utils'

@ICommand()
export class EnvListCommand extends Command {
    get options() {
        return {
            cmd: 'env:list',
            options: [],
            desc: '展示云开发环境信息',
            requiredEnvId: false
        }
    }

    @InjectParams()
    async execute(@Log() log: Logger) {
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

        const tableData = sortData.map((item) => [
            item.Alias,
            item.EnvId,
            item.PackageName || '按量计费',
            item.Source === 'miniapp' ? '小程序' : '云开发',
            item.CreateTime,
            item.Status === 'NORMAL' ? '正常' : '不可用'
        ])

        printHorizontalTable(head, tableData)
        // 不可用环境警告
        const unavailableEnv = data.find((item) => item.Status === 'UNAVAILABLE')
        if (unavailableEnv) {
            log.warn(`您的环境中存在不可用的环境：[${unavailableEnv.EnvId}]，请留意！`)
        }
    }
}

@ICommand()
export class EnvRenameCommand extends Command {
    get options() {
        return {
            cmd: 'env:rename <name>',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                }
            ],
            desc: '修改云开发环境别名',
            requiredEnvId: false
        }
    }

    @InjectParams()
    async execute(@EnvId() envId, @ArgsParams() params, @Log() log: Logger) {
        log.verbose(params)

        const name = params?.[0]
        if (!name) {
            throw new CloudBaseError('环境别名不能为空！')
        }

        await updateEnvInfo({
            envId: envId,
            alias: name
        })

        log.success('更新环境别名成功 ！')
    }
}
