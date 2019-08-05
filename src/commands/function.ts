import * as program from 'commander'
import * as inquirer from 'inquirer'
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
import { resolveTcbrcConfig, getEnvId } from '../utils'

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
    .command('function:deploy [name] [envId]')
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
            return batchCreateFunctions(
                functions,
                process.cwd(),
                assignEnvId,
                force
            )
        }

        const newFunction = functions.find(item => item.name === name)
        if (!newFunction || !newFunction.name) {
            throw new TcbError(`函数 ${name} 配置不存在`)
        }

        createFunction(newFunction, process.cwd(), assignEnvId, force)
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
        await listFunction(Number(limit), Number(offset), assignEnvId)
    })

// 删除云函数
program
    .command('function:delete [name] [envId]')
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
            return await batchDeleteFunctions(names, assignEnvId)
        }

        await deleteFunction(name, assignEnvId)
    })

// 获取云函数信息
program
    .command('function:detail [name] [envId]')
    .description('获取云函数信息')
    .action(async function(name: string, envId: string) {
        const assignEnvId = await getEnvId(envId)

        // 不指定云函数名称，获取配置文件中的所有函数信息
        if (!name) {
            const functions = await getConfigFunctions()
            const names = functions.map(item => item.name)
            return await batchGetFunctionsDetail(names, assignEnvId)
        }
        await getFunctionDetail(name, assignEnvId)
    })

// 打印函数日志
program
    .command('function:log <name> [envId]')
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

        await getFunctionLog(name, assignEnvId, params)
    })

// 更新云函数的配置
program
    .command('function:config:update [name] [envId]')
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
            return await batchUpdateFunctionConfig(functions, assignEnvId)
        }

        const functionItem = functions.find(item => item.name === name)

        if (!functionItem) {
            throw new TcbError('未找到相关函数配置，请检查函数名是否正确')
        }

        updateFunctionConfig(name, functionItem.config, assignEnvId)
    })

// 创建函数触发器
program
    .command('function:trigger:create [name] [envId]')
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
            return await batchCreateTriggers(functions, assignEnvId)
        }

        const functionItem = functions.find(item => item.name === name)

        if (!functionItem) {
            throw new TcbError('未找到相关函数配置，请检查函数名是否正确')
        }

        const { triggers } = functionItem

        if (!triggers || !triggers.length) {
            throw new TcbError('触发器配置不能为空')
        }

        createFunctionTriggers(name, triggers, assignEnvId)
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
            return await batchDeleteTriggers(functions, assignEnvId)
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
            return await batchDeleteTriggers([func], assignEnvId)
        }

        if (!triggerName) {
            throw new TcbError('触发器名称不能为空')
        }

        // 删除指定函数的单个触发器
        deleteFunctionTrigger(functionName, triggerName, assignEnvId)
    })
