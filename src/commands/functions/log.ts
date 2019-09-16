import chalk from 'chalk'
import { FunctionContext } from '../../types'
import { CloudBaseError } from '../../error'
import { getFunctionLog } from '../../function'

export async function log(ctx: FunctionContext, options: any) {
    const { name, envId } = ctx

    let {
        offset,
        limit,
        order,
        orderBy,
        error,
        success,
        startTime,
        endTime,
        reqId: functionRequestId
    } = options

    if (!name) {
        throw new CloudBaseError('云函数名称不能为空')
    }

    // 2019-05-16 20:59:59 时间类型的长度
    const TimeLength = 19

    if (
        typeof startTime !== 'undefined' &&
        typeof endTime !== 'undefined' &&
        (startTime.length !== TimeLength || endTime.length !== TimeLength)
    ) {
        throw new CloudBaseError(
            '时间格式错误，必须为 2019-05-16 20:59:59 类型'
        )
    }

    if (new Date(endTime).getTime() < new Date(startTime).getTime()) {
        throw new CloudBaseError('开始时间不能晚于结束时间')
    }

    const OneDay = 86400000
    if (new Date(endTime).getTime() - new Date(startTime).getTime() > OneDay) {
        throw new CloudBaseError('endTime 与 startTime 只能相差一天之内')
    }

    let params: any = {
        offset,
        limit,
        order,
        orderBy,
        startTime,
        endTime,
        functionRequestId
    }
    error && (params.filter = { RetCode: 'not0' })
    success && (params.filter = { RetCode: 'is0' })
    // 删除值为 undefined 的字段
    params = JSON.parse(JSON.stringify(params))

    const logs = await getFunctionLog({
        envId,
        functionName: name,
        ...params
    })

    const ResMap = {
        StartTime: '请求时间',
        FunctionName: '函数名称',
        BillDuration: '计费时间(ms)',
        Duration: '运行时间(ms)',
        InvokeFinished: '调用次数',
        MemUsage: '占用内存',
        RequestId: '请求 Id',
        RetCode: '调用状态',
        RetMsg: '返回结果'
    }

    console.log(chalk.green(`函数：${name} 调用日志：`) + '\n\n')

    if (logs.length === 0) {
        return console.log('无调用日志')
    }

    logs.forEach(log => {
        const info = Object.keys(ResMap)
            .map(key => {
                if (key === 'RetCode') {
                    return `${ResMap[key]}：${
                        Number(log[key]) === 0 ? '成功' : '失败'
                    }\n`
                }
                if (key === 'MemUsage') {
                    const str = Number(Number(log[key]) / 1024 / 1024).toFixed(
                        3
                    )
                    return `${ResMap[key]}：${str} MB\n`
                }
                return `${ResMap[key]}：${log[key]} \n`
            })
            .reduce((prev, next) => prev + next)
        console.log(info + `日志：\n ${log.Log} \n`)
    })
}
