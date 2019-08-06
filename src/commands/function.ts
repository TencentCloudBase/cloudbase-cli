import program from 'commander'
import inquirer from 'inquirer'
import chalk from 'chalk'
import { TcbError } from '../error'
import {
    listFunction,
    deleteFunction,
    getFunctionDetail,
    getFunctionLog,
    updateFunctionConfig,
    createFunction,
    batchCreateFunctions,
    createFunctionTriggers,
    deleteFunctionTrigger,
    batchCreateTriggers,
    batchDeleteFunctions,
    batchDeleteTriggers,
    batchGetFunctionsDetail,
    batchUpdateFunctionConfig
} from '../function'
import { resolveTcbrcConfig, getEnvId, printCliTable } from '../utils'
import { successLog } from '../logger'

// 获取函数配置并校验字段有效性
async function getConfigFunctions() {
    const config = await resolveTcbrcConfig()
    if (
        !config.functions ||
        !Array.isArray(config.functions) ||
        !config.functions.length
    ) {
        throw new TcbError('函数配置不存在')
    }

    const { functions } = config

    functions.forEach(func => {
        if (!func.name) {
            throw new TcbError('云函数名称不能为空')
        }
        // timeout 可能为 0
        if (typeof func.config.timeout !== 'undefined') {
            const timeout = Number(func.config.timeout)

            if (!Number.isInteger(timeout)) {
                throw new TcbError('超时时间必需为整数')
            }

            if (timeout < 1 || timeout > 20) {
                throw new TcbError('超时时间有效值为： 1~20S')
            }
        }
    })
    return functions
}

// 创建云函数
program
    .command('function:deploy [functionName] [envId]')
    .option('--force', '如果存在同名函数，上传后覆盖同名函数')
    .description('创建云函数')
    .action(async function(name: string, envId: string, options) {
        const assignEnvId = await getEnvId(envId)
        const functions = await getConfigFunctions()

        const { force } = options

        let isBatchCreating = false

        if (!name) {
            const { isBatch } = await inquirer.prompt({
                type: 'confirm',
                name: 'isBatch',
                message: '没有指定部署函数，是否部署配置文件中的全部函数？',
                default: false
            })
            isBatchCreating = isBatch
            // 用户不部署全部函数，报错
            if (!isBatchCreating) {
                throw new TcbError('请指定部署函数名称！')
            }
        }

        if (isBatchCreating) {
            return await batchCreateFunctions({
                functions,
                root: process.cwd(),
                envId: assignEnvId,
                force
            })
        }

        const newFunction = functions.find(item => item.name === name)
        if (!newFunction || !newFunction.name) {
            throw new TcbError(`函数 ${name} 配置不存在`)
        }

        createFunction({
            func: newFunction,
            root: process.cwd(),
            envId: assignEnvId,
            force
        })
    })

// 展示云函数列表
program
    .command('function:list [envId]')
    .option('-l, --limit <limit>', '返回数据长度，默认值为 20')
    .option('-o, --offset <offset>', '数据偏移量，默认值为 0')
    .description('展示云函数列表')
    .action(async function(envId: string, options: any) {
        let { limit = 20, offset = 0 } = options
        limit = Number(limit)
        offset = Number(offset)
        if (!Number.isInteger(limit) || !Number.isInteger(offset)) {
            throw new TcbError('limit 和 offset 必须为整数')
        }

        if (limit < 0 || offset < 0) {
            throw new TcbError('limit 和 offset 必须为大于 0 的整数')
        }

        const assignEnvId = await getEnvId(envId)
        const data = await listFunction({
            limit: Number(limit),
            offset: Number(offset),
            envId: assignEnvId
        })

        const head: string[] = ['Name', 'Runtime', 'AddTime', 'Description']
        const tableData = data.map(item => {
            const { FunctionName, Runtime, AddTime, Description } = item
            return [FunctionName, Runtime, AddTime, Description]
        })

        printCliTable(head, tableData)
    })

// 调用云函数
// program
//     .command('function:invoke [functionName] [envId]')
//     .description('调用云函数')
//     .action(async function(name: string, envId: string) {

//     })

// 删除云函数
program
    .command('function:delete [functionName] [envId]')
    .description('删除云函数')
    .action(async function(name: string, envId: string) {
        const assignEnvId = await getEnvId(envId)

        let isBatchDelete = false

        // 不指定云函数名称，默认删除所有函数
        if (!name) {
            const answer = await inquirer.prompt({
                type: 'confirm',
                name: 'isBatch',
                message: '无云函数名称，是否需要删除配置文件中的全部云函数？',
                default: false
            })

            // 危险操作，再次确认
            if (answer.isBatch) {
                const { reConfirm } = await inquirer.prompt({
                    type: 'confirm',
                    name: 'reConfirm',
                    message: '确定要删除配置文件中的全部云函数？',
                    default: false
                })
                isBatchDelete = reConfirm
            }

            if (!isBatchDelete) {
                throw new TcbError('请指定需要删除的云函数名称！')
            }
        }

        if (isBatchDelete) {
            const functions = await getConfigFunctions()
            const names: string[] = functions.map(item => item.name)
            return await batchDeleteFunctions({
                names,
                envId: assignEnvId
            })
        }

        await deleteFunction({
            functionName: name,
            envId: assignEnvId
        })
    })

function logDetail(info, name) {
    const ResMap = {
        Status: '状态',
        CodeInfo: '函数代码',
        CodeSize: '代码大小',
        Description: '描述',
        Environment: '环境变量(key=value)',
        FunctionName: '函数名称',
        FunctionVersion: '函数版本',
        Handler: '执行方法',
        MemorySize: '内存配置(MB)',
        ModTime: '修改时间',
        Namespace: '环境 Id',
        Runtime: '运行环境',
        Timeout: '超时时间(S)',
        Triggers: '触发器'
    }

    const funcInfo = Object.keys(ResMap)
        .map(key => {
            // 将环境变量数组转换成 key=value 的形式
            if (key === 'Environment') {
                const data = info[key].Variables.map(
                    item => `${item.Key}=${item.Value}`
                ).join('; ')
                return `${ResMap[key]}：${data} \n`
            }

            if (key === 'Triggers') {
                const data = info[key]
                    .map(item => `${item.TriggerName}：${item.TriggerDesc}`)
                    .join('\n')
                return `${ResMap[key]}：\n${data} \n`
            }

            return `${ResMap[key]}：${info[key]} \n`
        })
        .reduce((prev, next) => prev + next)
    console.log(chalk.green(`函数 [${name}] 信息：`) + '\n\n' + funcInfo)
}

// 获取云函数信息
program
    .command('function:detail [functionName] [envId]')
    .description('获取云函数信息')
    .action(async function(name: string, envId: string) {
        const assignEnvId = await getEnvId(envId)

        // 不指定云函数名称，获取配置文件中的所有函数信息
        if (!name) {
            const functions = await getConfigFunctions()
            const names = functions.map(item => item.name)
            const data = await batchGetFunctionsDetail({
                names,
                envId: assignEnvId
            })
            data.forEach(info => logDetail(info, name))
            return
        }

        const data = await getFunctionDetail({
            functionName: name,
            envId: assignEnvId
        })
        logDetail(data, name)
    })

// 打印函数日志
program
    .command('function:log <functionName> [envId]')
    .description('打印云函数日志')
    .option('-i, --reqId <reqId>', '函数请求 Id')
    .option(
        '-o, --offset <offset>',
        '数据的偏移量，Offset + Limit不能大于10000'
    )
    .option(
        '-l, --limit <limit>',
        '返回数据的长度，Offset + Limit不能大于10000'
    )
    .option(
        '--order <order>',
        '以升序还是降序的方式对日志进行排序，可选值 desc 和 asc'
    )
    .option(
        '--orderBy <orderBy>',
        '根据某个字段排序日志,支持以下字段：function_name, duration, mem_usage, start_time'
    )
    .option(
        '--startTime <startTime>',
        '查询的具体日期，例如：2019-05-16 20:00:00，只能与 endtime 相差一天之内'
    )
    .option(
        '--endTime <endTime>',
        '查询的具体日期，例如：2019-05-16 20:59:59，只能与 startTime 相差一天之内'
    )
    .option('-e, --error', '只返回错误类型的日志')
    .option('-s, --success', '只返回正确类型的日志')
    .action(async function(name: string, envId: string, options: any) {
        const assignEnvId = await getEnvId(envId)

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
            throw new TcbError('云函数名称不能为空')
        }

        // 2019-05-16 20:59:59 时间类型的长度
        const TimeLength = 19

        if (
            typeof startTime !== 'undefined' &&
            typeof endTime !== 'undefined' &&
            (startTime.length !== TimeLength || endTime.length !== TimeLength)
        ) {
            throw new TcbError('时间格式错误，必须为 2019-05-16 20:59:59 类型')
        }

        if (new Date(endTime).getTime() < new Date(startTime).getTime()) {
            throw new TcbError('开始时间不能晚于结束时间')
        }

        const OneDay = 86400000
        if (
            new Date(endTime).getTime() - new Date(startTime).getTime() >
            OneDay
        ) {
            throw new TcbError('endTime 与 startTime 只能相差一天之内')
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
            functionName: name,
            envId: assignEnvId,
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
                        const str = Number(
                            Number(log[key]) / 1024 / 1024
                        ).toFixed(3)
                        return `${ResMap[key]}：${str} MB\n`
                    }
                    return `${ResMap[key]}：${log[key]} \n`
                })
                .reduce((prev, next) => prev + next)
            console.log(info + `日志：\n ${log.Log} \n`)
        })
    })

// 更新云函数的配置
program
    .command('function:config:update [functionName] [envId]')
    .description('更新云函数配置')
    .action(async function(name: string, envId: string) {
        const assignEnvId = await getEnvId(envId)

        let isBathUpdate = false

        // 不指定云函数名称，更新配置文件中所有函数的配置
        if (!name) {
            const { isBatch } = await inquirer.prompt({
                type: 'confirm',
                name: 'isBatch',
                message:
                    '无云函数名称，是否需要更新配置文件中的【全部云函数】的配置？',
                default: false
            })

            isBathUpdate = isBatch

            if (!isBathUpdate) {
                throw new TcbError('请指定云函数名称！')
            }
        }

        const functions = await getConfigFunctions()

        if (isBathUpdate) {
            await batchUpdateFunctionConfig({
                functions,
                envId: assignEnvId
            })
            successLog('更新云函数配置成功！')
            return
        }

        const functionItem = functions.find(item => item.name === name)

        if (!functionItem) {
            throw new TcbError('未找到相关函数配置，请检查函数名是否正确')
        }

        await updateFunctionConfig({
            functionName: name,
            config: functionItem.config,
            envId: assignEnvId
        })

        successLog('更新云函数配置成功！')
    })

// 创建函数触发器
program
    .command('function:trigger:create [functionName] [envId]')
    .description('创建云函数触发器')
    .action(async function(name: string, envId: string) {
        const assignEnvId = await getEnvId(envId)

        let isBatchCreateTrigger = false

        // 不指定云函数名称，创建配置文件中所有函数的所有触发器
        if (!name) {
            const { isBatch } = await inquirer.prompt({
                type: 'confirm',
                name: 'isBatch',
                message:
                    '无云函数名称，是否需要部署配置文件中的【全部云函数】的全部触发器？',
                default: false
            })

            isBatchCreateTrigger = isBatch

            if (!isBatchCreateTrigger) {
                throw new TcbError('请指定云函数名称！')
            }
        }

        const functions = await getConfigFunctions()

        if (isBatchCreateTrigger) {
            return await batchCreateTriggers({
                functions,
                envId: assignEnvId
            })
        }

        const functionItem = functions.find(item => item.name === name)

        if (!functionItem) {
            throw new TcbError('未找到相关函数配置，请检查函数名是否正确')
        }

        const { triggers } = functionItem

        if (!triggers || !triggers.length) {
            throw new TcbError('触发器配置不能为空')
        }

        await createFunctionTriggers({
            functionName: name,
            triggers,
            envId: assignEnvId
        })
    })

// 删除函数触发器
program
    .command('function:trigger:delete [functionName] [triggerName] [envId]')
    .description('创建云函数触发器')
    .action(async function(
        functionName: string,
        triggerName: string,
        envId: string
    ) {
        const assignEnvId = await getEnvId(envId)

        let isBtachDeleteTriggers
        let isBatchDeleteFunctionTriggers = false

        // 不指定云函数名称，删除配置文件中所有函数的所有触发器
        if (!functionName) {
            const answer = await inquirer.prompt({
                type: 'confirm',
                name: 'isBatch',
                message:
                    '无云函数名称，是否需要删除配置文件中的【全部云函数】的全部触发器？',
                default: false
            })

            // 危险操作，再次确认
            if (answer.isBatch) {
                const { reConfirm } = await inquirer.prompt({
                    type: 'confirm',
                    name: 'reConfirm',
                    message:
                        '确定要删除配置文件中的【全部云函数】的全部触发器？',
                    default: false
                })
                isBtachDeleteTriggers = reConfirm
            }

            if (!isBtachDeleteTriggers) {
                throw new TcbError('请指定云函数名称以及触发器名称！')
            }
        }

        if (isBtachDeleteTriggers) {
            const functions = await getConfigFunctions()
            return await batchDeleteTriggers({
                functions,
                envId: assignEnvId
            })
        }

        // 指定了函数名称，但没有指定触发器名称，删除此函数的所有触发器
        if (!triggerName && functionName) {
            const { isBatch } = await inquirer.prompt({
                type: 'confirm',
                name: 'isBatch',
                message: '没有指定触发器名称，是否需要此云函数的全部触发器？',
                default: false
            })

            isBatchDeleteFunctionTriggers = isBatch

            if (!isBatchDeleteFunctionTriggers) {
                throw new TcbError('请指定云函数名称以及触发器名称！')
            }
        }

        if (isBatchDeleteFunctionTriggers) {
            const functions = await getConfigFunctions()
            const func = functions.find(item => item.name === functionName)
            return await batchDeleteTriggers({
                functions: [func],
                envId: assignEnvId
            })
        }

        if (!triggerName) {
            throw new TcbError('触发器名称不能为空')
        }

        // 删除指定函数的单个触发器
        deleteFunctionTrigger({
            functionName,
            triggerName,
            envId: assignEnvId
        })
    })
