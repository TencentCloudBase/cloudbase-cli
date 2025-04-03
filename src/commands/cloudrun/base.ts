import camelcaseKeys from 'camelcase-keys'
import { IAC, utils as IACUtils, CloudAPI as _CloudAPI } from '@cloudbase/iac-core'
import inquirer from 'inquirer'
import path from 'path'
import { ArgsOptions, CmdContext, EnvId, InjectParams, Log, Logger } from '../../decorators'
import { Command, ICommand } from '../common'
import { EnvSource } from '../constants'
import { getCredential, getPackageJsonName, selectEnv, trackCallback } from '../utils'

const { CloudAPI } = _CloudAPI

@ICommand()
export class CloudRunDeployCommand extends Command {
    get options() {
        return {
            cmd: 'cloudrun',
            childCmd: 'deploy',
            options: [
                {
                    flags: '-e, --envId <envId>',
                    desc: '环境 Id'
                },
                {
                    flags: '-s, --serviceName <serviceName>',
                    desc: '服务名称'
                },
                {
                    flags: '--source <source>',
                    desc: '目标云托管代码文件所在目录路径。默认为当前路径'
                }
            ],
            requiredEnvId: false,
            autoRunLogin: true,
            desc: '部署云托管服务'
        }
    }

    @InjectParams()
    async execute(@CmdContext() ctx, @EnvId() envId, @Log() log: Logger, @ArgsOptions() options) {
        let { serviceName, source } = options

        const targetDir = path.resolve(source || process.cwd())

        /**
         * 选择环境
         */
        if (!envId) {
            const envConfig: any = camelcaseKeys(await IACUtils.loadEnv(targetDir))
            if (envConfig.envId) {
                envId = envConfig.envId
                log.info(`当前环境 Id：${envId}`)
            } else {
                envId = await _selectEnv()
            }
        } else {
            log.info(`当前环境 Id：${envId}`)
        }

        /**
         * 选择服务
         */
        if (!serviceName) {
            const { shortName } = await getPackageJsonName(path.join(targetDir, 'package.json'))
            serviceName = await _inputServiceName(shortName)
        }

        /**
         * 部署确认
         */
        const answers = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'confirm',
                message: `即将开始部署，是否确认继续？`,
                default: true
            }
        ])
        if (!answers.confirm) {
            return
        }

        /**
         * 初始化 IAC
         */
        await IAC.init({
            cwd: targetDir,
            getCredential: () => {
                return getCredential(ctx, options)
            },
            polyRepoMode: true
        })

        /**
         * 执行部署
         */

        await _runDeploy()

        async function _runDeploy() {
            try {
                const res = await IAC.Cloudrun.apply(
                    {
                        cwd: targetDir,
                        envId: envId,
                        name: serviceName
                    },
                    function (message) {
                        trackCallback(message, log)
                    }
                )
                const { envId: _envId, name, resourceType: _resourceType } = res?.data
                trackCallback(
                    {
                        details: `请打开链接查看部署状态: https://tcb.cloud.tencent.com/dev?envId=${_envId}#/platform-run/service/detail?serverName=${name}&tabId=deploy&envId=${_envId}`
                    },
                    log
                )
            } catch (e) {
                if (e?.action === 'UpdateCloudRunServer' && e?.code === 'ResourceInUse') {
                    inquirer
                        .prompt([
                            {
                                type: 'confirm',
                                name: 'confirm',
                                message: `平台当前有部署发布任务正在运行中。确认继续部署，正在执行的部署任务将被取消，并立即部署最新的代码`,
                                default: true
                            }
                        ])
                        .then(async (answers) => {
                            if (answers.confirm) {
                                try {
                                    // 获取任务信息
                                    const { task } = await CloudAPI.tcbrServiceRequest(
                                        'DescribeServerManageTask',
                                        {
                                            envId,
                                            serverName: serviceName,
                                            taskId: 0
                                        }
                                    )
                                    const id = task?.id
                                    // 停止任务
                                    await CloudAPI.tcbrServiceRequest('OperateServerManage', {
                                        envId,
                                        operateType: 'cancel',
                                        serverName: serviceName,
                                        taskId: id
                                    })
                                    // 重新部署
                                    await _runDeploy()
                                } catch (e: any) {
                                    trackCallback(
                                        {
                                            type: 'error',
                                            details: e.message
                                        },
                                        log
                                    )
                                }
                            }
                        })
                } else {
                    trackCallback(
                        {
                            type: 'error',
                            details: `${e.message}`,
                            originalError: e
                        },
                        log
                    )
                }
            }
        }
    }
}

async function _selectEnv() {
    return selectEnv({ source: [EnvSource.MINIAPP, EnvSource.QCLOUD] })
}

async function _inputServiceName(defaultVal: string = '') {
    const questions = [
        {
            type: 'input',
            name: 'serviceName',
            message: '请输入服务名称',
            default: defaultVal,
            validate: (val: string) => {
                const isValid =
                    !val.startsWith('lcap') &&
                    !val.startsWith('lowcode') &&
                    /^[A-Za-z][\w-_]{0,43}[A-Za-z0-9]$/.test(val)
                return isValid
                    ? true
                    : '支持大小写字母、数字、-和_，但必须以字母开头、以字母和数字结尾，不支持以lcap、lowcode开头，最长45个字符'
            }
        }
    ]
    const answers = await inquirer.prompt(questions)
    return answers['serviceName']
}