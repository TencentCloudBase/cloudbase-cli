import chalk from 'chalk'
import { FunctionContext } from '../../types'
import { batchGetFunctionsDetail, getFunctionDetail } from '../../function'
import { loadingFactory } from '../../utils'
import { CloudBaseError } from '../../error'

const StatusMap = {
    Active: '部署完成',
    Creating: '创建中',
    CreateFailed: '创建失败',
    Updating: '更新中',
    UpdateFailed: '更新失败'
}

function logDetail(info, name) {
    const ResMap = {
        Status: '状态',
        CodeSize: '代码大小（B）',
        Environment: '环境变量(key=value)',
        FunctionName: '函数名称',
        Handler: '执行方法',
        MemorySize: '内存配置(MB)',
        ModTime: '修改时间',
        Namespace: '环境 Id',
        Runtime: '运行环境',
        Timeout: '超时时间(S)',
        VpcConfig: '网络配置',
        Triggers: '触发器',
        CodeInfo: '函数代码（Java 函数以及入口大于 1 M 的函数不会显示）'
    }

    const funcInfo = Object.keys(ResMap)
        .map(key => {
            if (key === 'Status') {
                return `${ResMap[key]}：${StatusMap[info[key]]} \n`
            }
            // 将环境变量数组转换成 key=value 的形式
            if (key === 'Environment') {
                const data = info[key].Variables.map(item => `${item.Key}=${item.Value}`).join('; ')
                return `${ResMap[key]}：${data} \n`
            }

            if (key === 'Triggers') {
                let data = info[key]
                    .map(item => `${item.TriggerName}：${item.TriggerDesc}`)
                    .join('\n')
                data = data.length ? `${data}\n` : '无'
                return `${ResMap[key]}：\n${data}`
            }

            if (key === 'VpcConfig') {
                const { vpc, subnet }: any = info[key]
                if (typeof vpc === 'string') {
                    return `${ResMap[key]}：${vpc}/${subnet}\n`
                } else if (vpc && subnet) {
                    return `${ResMap[key]}：${vpc.VpcId}(${vpc.VpcName} | ${subnet.CidrBlock}) / ${subnet.SubnetId}(${subnet.SubnetName})\n`
                } else {
                    return `${ResMap[key]}：无\n`
                }
            }

            if (key === 'CodeInfo') {
                return `${ResMap[key]}：\n${info[key]}`
            }

            return `${ResMap[key]}：${info[key]} \n`
        })
        .reduce((prev, next) => prev + next)
    console.log(chalk.green(`函数 [${name}] 信息：`) + '\n\n' + funcInfo)
}

export async function detail(ctx: FunctionContext, options) {
    const { envId, name, functions } = ctx
    const { codeSecret } = options

    const loading = loadingFactory()
    loading.start('获取函数信息中...')

    // 不指定云函数名称，获取配置文件中的所有函数信息
    if (!name) {
        const names = functions.map(item => item.name)
        const data = await batchGetFunctionsDetail({
            names,
            envId,
            codeSecret
        })
        data.forEach(info => logDetail(info, name))
        return
    }

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
