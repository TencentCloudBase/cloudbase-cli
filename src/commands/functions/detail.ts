import chalk from 'chalk'
import { Command, ICommand } from '../common'
import { CloudBaseError } from '../../error'
import { getFunctionDetail } from '../../function'
import { loadingFactory, printHorizontalTable } from '../../utils'
import { InjectParams, ArgsParams, CmdContext, Log, Logger } from '../../decorators'

const StatusMap = {
    Active: '部署完成',
    Creating: '创建中',
    CreateFailed: '创建失败',
    Updating: '更新中',
    UpdateFailed: '更新失败'
}

@ICommand()
export class FunctionDetail extends Command {
    get options() {
        return {
            cmd: 'functions:detail <name>',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                },
                {
                    flags: '--code-secret <codeSecret>',
                    desc: '代码加密的函数的 CodeSecret'
                }
            ],
            desc: '获取云函数信息'
        }
    }

    @InjectParams()
    async execute(@CmdContext() ctx, @ArgsParams() params) {
        const { envId, options } = ctx
        const { codeSecret } = options
        const name = params?.[0]

        if (!name) {
            throw new CloudBaseError('请指定云函数名称！')
        }

        const loading = loadingFactory()
        loading.start('获取函数信息中...')

        try {
            const data = await getFunctionDetail({
                envId,
                functionName: name,
                codeSecret
            })

            loading.stop()
            this.logDetail(data, name)
        } catch (e) {
            if (e.code === 'ResourceNotFound.FunctionName') {
                throw new CloudBaseError(`[${name}] 函数不存在`)
            }
            throw e
        } finally {
            loading.stop()
        }
    }

    @InjectParams()
    logDetail(info, name, @Log() log?: Logger) {
        const ResMap = {
            Namespace: '环境 Id',
            FunctionName: '函数名称',
            Status: '状态',
            CodeSize: '代码大小（B）',
            Environment: '环境变量(key=value)',
            Handler: '执行方法',
            MemorySize: '内存配置(MB)',
            Runtime: '运行环境',
            Timeout: '超时时间(S)',
            VpcConfig: '网络配置',
            Triggers: '触发器',
            ModTime: '修改时间',
            InstallDependency: '自动安装依赖'
        }

        const head = ['信息', '值']

        const tableData = Object.keys(ResMap).map((key) => {
            if (key === 'Status') {
                return [ResMap[key], StatusMap[info[key]]]
            }
            // 将环境变量数组转换成 key=value 的形式
            if (key === 'Environment') {
                const data =
                    info[key].Variables.map((item) => `${item.Key}=${item.Value}`).join('; ') ||
                    '无'
                return [ResMap[key], data]
            }

            if (key === 'Triggers') {
                let data = info[key]
                    .map((item) => `${item.TriggerName}：${item.TriggerDesc}`)
                    .join('\n')
                data = data.length ? `${data}\n` : '无'
                return [ResMap[key], data]
            }

            if (key === 'VpcConfig') {
                const { vpc, subnet }: any = info[key]
                if (typeof vpc === 'string') {
                    return [ResMap[key], `${vpc}/${subnet}`]
                } else if (vpc && subnet) {
                    const data = `${vpc.VpcId}(${vpc.VpcName} | ${subnet.CidrBlock}) / ${subnet.SubnetId}(${subnet.SubnetName})`

                    return [ResMap[key], data]
                } else {
                    return [ResMap[key], '无']
                }
            }

            if (key === 'CodeInfo') {
                return [ResMap[key], info[key]]
            }

            return [ResMap[key], info[key]]
        })

        if (info.StatusDesc) {
            tableData.push(['状态描述', info.StatusDesc])
        }

        log.info(chalk.green(`云函数 [${name}] 详情：`))
        printHorizontalTable(head, tableData)
        log.info('函数代码（Java 函数以及入口大于 1 M 的函数不会显示）\n')
        log.log(info['CodeInfo'])
    }
}
