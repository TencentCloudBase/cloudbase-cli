import chalk from 'chalk'
import { FunctionContext } from '../../types'
import { batchGetFunctionsDetail, getFunctionDetail } from '../../function'
import { loadingFactory, printHorizontalTable } from '../../utils'
import { CloudBaseError } from '../../error'

const StatusMap = {
    Active: '部署完成',
    Creating: '创建中',
    CreateFailed: '创建失败',
    Updating: '更新中',
    UpdateFailed: '更新失败'
}

function logDetail(info, name) {
    console.log(info)
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

    const tableData = Object.keys(ResMap).map(key => {
        if (key === 'Status') {
            return [ResMap[key], StatusMap[info[key]]]
        }
        // 将环境变量数组转换成 key=value 的形式
        if (key === 'Environment') {
            const data =
                info[key].Variables.map(item => `${item.Key}=${item.Value}`).join('; ') || '无'
            return [ResMap[key], data]
        }

        if (key === 'Triggers') {
            let data = info[key].map(item => `${item.TriggerName}：${item.TriggerDesc}`).join('\n')
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

    console.log(chalk.green(`函数 [${name}] 信息：`) + '\n\n')
    printHorizontalTable(head, tableData)
    console.log('\n函数代码（Java 函数以及入口大于 1 M 的函数不会显示）\n')
    console.log(info['CodeInfo'])
}

export async function detail(ctx: FunctionContext, options) {
    const { envId, name } = ctx
    const { codeSecret } = options

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

        logDetail(data, name)
    } catch (e) {
        if (e.code === 'ResourceNotFound.FunctionName') {
            throw new CloudBaseError(`[${name}] 函数不存在`)
        }
        throw e
    } finally {
        loading.stop()
    }
}
