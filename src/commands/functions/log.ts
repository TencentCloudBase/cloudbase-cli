import chalk from 'chalk'
import { Command, ICommand } from '../common'
import { CloudBaseError } from '../../error'
import { getFunctionLog } from '../../function'
import { InjectParams, CmdContext, ArgsParams, Log, Logger } from '../../decorators'

@ICommand()
export class FunctionLog extends Command {
    get options() {
        return {
            cmd: 'functions:log <name>',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                },
                { flags: '-i, --reqId <reqId>', desc: '函数请求 Id' },
                {
                    flags: '-o, --offset <offset>',
                    desc: '数据的偏移量，Offset + Limit不能大于10000'
                },
                {
                    flags: '-l, --limit <limit>',
                    desc: '返回数据的长度，Offset + Limit不能大于10000'
                },
                {
                    flags: '--order <order>',
                    desc: '以升序还是降序的方式对日志进行排序，可选值 desc 和 asc'
                },
                {
                    flags: '--orderBy <orderBy>',
                    desc:
                        '根据某个字段排序日志,支持以下字段：function_name, duration, mem_usage, start_time'
                },
                {
                    flags: '--startTime <startTime>',
                    desc: '查询的具体日期，例如：2019-05-16 20:00:00，只能与 endtime 相差一天之内'
                },
                {
                    flags: '--endTime <endTime>',
                    desc: '查询的具体日期，例如：2019-05-16 20:59:59，只能与 startTime 相差一天之内'
                },
                { flags: '-e, --error', desc: '只返回错误类型的日志' },
                { flags: '-s, --success', desc: '只返回正确类型的日志' }
            ],
            desc: '打印云函数日志'
        }
    }

    @InjectParams()
    async execute(@CmdContext() ctx, @ArgsParams() argsParams, @Log() log: Logger) {
        const { envId, options } = ctx
        const name = argsParams?.[0]

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
            throw new CloudBaseError('时间格式错误，必须为 2019-05-16 20:59:59 类型')
        }

        if (new Date(endTime).getTime() < new Date(startTime).getTime()) {
            throw new CloudBaseError('开始时间不能晚于结束时间')
        }

        const OneDay = 86400000
        if (new Date(endTime).getTime() - new Date(startTime).getTime() > OneDay) {
            throw new CloudBaseError('endTime 与 startTime 只能相差一天之内')
        }

        let params: any = {
            order,
            orderBy,
            startTime,
            endTime,
            functionRequestId,
            offset: Number(offset),
            limit: Number(limit)
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

        log.success(chalk.green(`函数：${name} 调用日志：\n`))

        if (logs.length === 0) {
            return log.info('无调用日志')
        }

        logs.forEach((log) => {
            const info = Object.keys(ResMap)
                .map((key) => {
                    if (key === 'RetCode') {
                        return `${ResMap[key]}：${Number(log[key]) === 0 ? '成功' : '失败'}\n`
                    }
                    if (key === 'MemUsage') {
                        const str = Number(Number(log[key]) / 1024 / 1024).toFixed(3)
                        return `${ResMap[key]}：${str} MB\n`
                    }
                    return `${ResMap[key]}：${log[key]} \n`
                })
                .reduce((prev, next) => prev + next)
            console.log(info + `日志：\n ${log.Log} \n`)
        })
    }
}
