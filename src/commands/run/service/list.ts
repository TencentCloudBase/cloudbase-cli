import { Command, ICommand } from '../../common'
import { InjectParams, ArgsOptions } from '../../../decorators'
import { listService } from '../../../run'
import { printHorizontalTable, genClickableLink, loadingFactory } from '../../../utils'
import { checkTcbrEnv, logEnvCheck } from '../../../utils/checkTcbrEnv'
import { EnumEnvCheck } from '../../../constant'

@ICommand()
export class ListServiceTcbr extends Command {
    get options() {
        return {
            cmd: 'run',
            childCmd: 'service:list',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                },
                {
                    flags: '-s, --serviceName <serviceName>',
                    desc: '服务名'
                },
                {
                    flags: '-h, --help',
                    desc: '查看帮助信息'
                },
                {
                    flags: '--json',
                    desc: '以 JSON 形式展示结果'
                }
            ],
            desc: '展示环境下服务信息'
        }
    }

    @InjectParams()
    async execute(@ArgsOptions() options) {

        let { envId, serviceName = '' } = options

        let envCheckType = await checkTcbrEnv(envId, true)
        if (envCheckType !== EnumEnvCheck.EnvFit) {
            logEnvCheck(envId, envCheckType)
            return
        }

        const loading = loadingFactory()

        const head = ['服务名称', '状态', '公网访问', '创建时间', '更新时间']
        loading.start('正在获取服务列表')
        const serverList = await listService({
            envId: envId
        })
        loading.stop()

        if (!serverList.length) {
            console.log('当前环境下没有服务')
            return
        }

        const specificServer = serverList.filter(serverItem => serverItem.ServerName === serviceName)

        // 打印 JSON 形式结果
        if (options.json) {
            console.log(JSON.stringify({
                code: 0,
                errmsg: 'success',
                data: specificServer.length ?
                    specificServer
                    : serverList
            }, null, 2))
            return
        }

        // 如有指定服务名，则只打印指定服务的信息
        let tableData: (string | number)[][]
        if (specificServer.length) {
            tableData = [[
                specificServer[0].ServerName,
                specificServer[0].Status,
                `是 ${genClickableLink(specificServer[0].DefaultDomainName)}`,
                specificServer[0].CreatedTime,
                specificServer[0].UpdateTime
            ]]
        } else {
            tableData = serverList.map(serverItem => [
                serverItem.ServerName,
                serverItem.Status,
                `是 ${genClickableLink(serverItem.DefaultDomainName)}`,
                serverItem.CreatedTime,
                serverItem.UpdateTime
            ])
        }

        printHorizontalTable(head, tableData)

    }
}