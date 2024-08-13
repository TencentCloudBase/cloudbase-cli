import path from 'path'
import { Command, ICommand } from '../common'
import { CloudBaseError } from '../../error'
import { listEnvs } from '../../env'
import { InjectParams, EnvId, ArgsParams, ArgsOptions, Log, Logger } from '../../decorators'
import { printHorizontalTable, loadingFactory, genClickableLink } from '../../utils'
import inquirer from 'inquirer'
import chalk from 'chalk'
import fs from 'fs-extra'
// import { run } from './fun-framework'

@ICommand()
export class FunListCommand extends Command {
    get options() {
        return {
            cmd: 'fun',
            childCmd: 'list',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                }
            ],
            requiredEnvId: false,
            autoRunLogin: true,
            desc: '列出云端所有的函数式托管服务'
        }
    }

    @InjectParams()
    async execute(@EnvId() envId, @Log() log: Logger) {
        const loading = loadingFactory()

        if (!envId) {
            envId = await selectEnv()
        } else {
            log.info(`当前环境 Id：${envId}`)
        }
    }
}

@ICommand()
export class FunDeployCommand extends Command {
    get options() {
        return {
            cmd: 'fun',
            childCmd: 'deploy',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                },
            ],
            requiredEnvId: false,
            autoRunLogin: true,
            desc: '部署函数式托管代码'
        }
    }

    @InjectParams()
    async execute(@EnvId() envId, @ArgsParams() params, @Log() log: Logger) {
    }
}

@ICommand()
export class FunRunCommand extends Command {
    get options() {
        return {
            cmd: 'fun',
            childCmd: 'run',
            options: [
                {
                    flags: '--source <source>',
                    desc: '目标函数文件路径，默认为 index.js, index.cjs 或 index.mjs'
                },
                {
                    flags: '--port <port>',
                    desc: '监听的端口，默认为 3000'
                },
                {
                    flags: '--target <target>',
                    desc: '目标函数名称，默认为 main'
                },
                {
                    flags: '--signatureType <signatureType>',
                    desc: '函数格式，默认为 event，当前仅支持 event'
                },
                {
                    flags: '--gracefulShutdown <gracefulShutdown>',
                    desc: '是否启用服务的优雅停止，默认为 true'
                },
                {
                    flags: 'KILL_TIMEOUT <timeout>',
                    desc: '优雅停止时，等待请求处理完成的超时时间，默认为 5000 毫秒'
                },
                {
                    flags: '--timeout <timeout>',
                    desc: 'Node.js Server 超时时间，默认为 0，见 https://nodejs.org/api/http.html#servertimeout'
                },
                {
                    flags: '--keepAliveTimeout <keepAliveTimeout>',
                    desc: 'Node.js Server keep-alive 超时时间，默认为 65000 毫秒，见 https://nodejs.org/api/http.html#server-keepalivetimeout'
                },
                {
                    flags: '--captureStack <captureStack>',
                    desc: '请求出错时，是否返回错误堆栈，默认为 NODE_ENV 不为 production 时开启'
                },
                {
                    flags: '--concurrencyLimit <concurrencyLimit>',
                    desc: '并发请求数限制，默认为 0，0 为不限制'
                },
                {
                    flags: '--noExit <noExit>',
                    desc: '是否禁用 process.exit() 避免进程意外退出，默认为 false'
                },
                {
                    flags: '--logHeaderBody <logHeaderBody>',
                    desc: '是否在请求日志中记录请求头、请求体、响应头、响应体，默认为 false，如记录，将会限制 body 大小为 2KB'
                },
                {
                    flags: '--dry-run',
                    desc: '是否不启动服务，只验证代码可以正常加载，默认为 false'
                },
                {
                    flags: '--logDirname <logDirname>',
                    desc: '日志文件目录，默认为 ./logs'
                },
                {
                    flags: '--maxLogFileSize <maxLogFileSize>',
                    desc: '单个日志文件最大字节数，默认为 128MB'
                },
                {
                    flags: '--maxLogFiles <maxLogFiles>',
                    desc: '最多同时存在的日志文件数量，默认为 4'
                },
                {
                    flags: '-w, --watch',
                    desc: '是否启用热重启模式，如启用，将会在文件变更时自动重启服务，默认为 false'
                }
            ],
            requiredEnvId: false,
            desc: '本地运行函数式托管代码'
        }
    }

    @InjectParams()
    async execute(@ArgsOptions() params, @Log() logger: Logger) {
        console.log(params)
        if (!params.sourceLocation) {
            throw new CloudBaseError('请指定要运行的函数文件路径')
        }

        // await run(params, logger)
    }
}

async function selectEnv() {
    const data = await listEnvs()

    const sortData = data.sort((prev, next) => {
        if (prev.Alias > next.Alias) {
            return 1
        }
        if (prev.Alias < next.Alias) {
            return -1
        }
        return 0
    })

    const choices = sortData.map((item) => {
        return {
            name: `${item.Alias || item.EnvId}  (${item.EnvId}) ${item.Status === 'NORMAL' ? '正常' : '不可用'}`,
            value: item.EnvId,
            short: item.envId
        }
    })

    const questions = [
        {
            type: 'list',
            name: 'env',
            message: '请先选择一个云开发环境',
            choices: choices
        }
    ]

    const answers = await inquirer.prompt(questions)

    return answers.env
}