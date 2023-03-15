import _ from 'lodash'
import open from 'open'
import { prompt } from 'enquirer'
import { getDataFromWeb, isCamRefused } from '@cloudbase/toolbox'
import { CloudBaseError } from '../error'
import { listEnvs, getEnvInfo } from '../env'
import { ENV_STATUS, STATUS_TEXT } from '../constant'
import { CloudApiService, getMangerService } from './net'
import { execWithLoading } from './output'
import { logger } from './log'

const tcbService = CloudApiService.getInstance('tcb')

const ENV_INIT_TIP = '环境初始化中，预计需要三分钟'
const CREATE_ENV = 'CREATE'
const consoleUrl = 'https://console.cloud.tencent.com/tcb/env/index?action=CreateEnv&from=cli'

/**
 * 展示环境列表选择器，获取用户选择的环境
 */
export async function getSelectedEnv(inputEnvId?: string) {
    // 检查是否开通 TCB 服务
    const isInitNow = await checkTcbService()

    let envData = []

    // 刚初始化服务，新创建的环境还未就绪
    if (isInitNow) {
        envData = await execWithLoading(
            () => {
                // 等待用户完成创建环境的流程
                return new Promise((resolve) => {
                    const timer = setInterval(async () => {
                        const envs = await listEnvs()
                        if (envs.length) {
                            clearInterval(timer)
                            resolve(envs)
                        }
                    }, 2000)
                })
            },
            {
                startTip: '获取环境列表中'
            }
        )
    } else {
        // 选择环境
        envData = await execWithLoading(() => listEnvs(), {
            startTip: '获取环境列表中'
        })
    }

    envData = envData || []

    // 检查输入的环境 Id 是否属于用户
    if (envData?.length && inputEnvId) {
        const inputEnvIdExist = envData.find((_) => _.EnvId === inputEnvId)
        if (!inputEnvIdExist) {
            throw new CloudBaseError(`你指定的环境 Id ${inputEnvId} 不存在，请指定正确的环境 Id！`)
        }
        return inputEnvId
    }

    // 按名称排序，构造展示数据
    const envs: { name: string; value: string }[] = envData
        .map((item) => {
            let name = `${item.Alias} - [${item.EnvId}:${item.PackageName || '按量计费'}]`
            if (item.Status !== ENV_STATUS.NORMAL) {
                name += `（${STATUS_TEXT[item.Status]}）`
            }

            return {
                name,
                value: item.EnvId
            }
        })
        .sort((prev, next) => prev.value.charCodeAt(0) - next.value.charCodeAt(0))

    const choices = [
        ...envs,
        {
            name: envData.length ? '创建新环境' : '无可用环境，创建新环境',
            value: CREATE_ENV
        }
    ]

    let { env } = await prompt<any>({
        choices,
        type: 'select',
        name: 'env',
        message: '请选择关联环境',
        result(choice) {
            return this.map(choice)[choice]
        }
    })

    // 创建新环境
    if (env === CREATE_ENV) {
        logger.success('已打开控制台，请前往控制台创建环境')
        // 从控制台获取创建环境生成的 envId
        const { envId } = await getDataFromWeb((port) => `${consoleUrl}&port=${port}`, 'getData')
        if (!envId) {
            throw new CloudBaseError('接收环境 Id 信息失败，请重新运行 init 命令！')
        }
        logger.success(`创建环境成功，环境 Id: ${envId}`)
        env = envId
    }

    // 检查环境状态
    await checkEnvStatus(env)

    return env
}

// 选择地域
export async function getSelectRegion() {
    const { region } = await prompt<any>({
        choices: [
            {
                name: '上海',
                value: 'ap-shanghai'
            },
            {
                name: '广州',
                value: 'ap-guangzhou'
            }
        ],
        type: 'select',
        name: 'region',
        message: '请选择环境所在地域',
        result(choice) {
            return this.map(choice)[choice]
        }
    })

    tcbService.region = region

    return region
}

// 检查 TCB 服务是否开通
export async function checkTcbService(): Promise<boolean> {
    const app = await getMangerService()
    let Initialized
    try {
        Initialized = (await app.env.checkTcbService()).Initialized
    } catch (e) {
        // 忽略 CAM 权限问题
        if (!isCamRefused(e)) {
            throw e
        }
    }

    if (!Initialized) {
        const { jump } = await prompt<any>({
            type: 'confirm',
            name: 'jump',
            message:
                '你还没有开通云开发服务，是否跳转到控制台开通云开发服务？（取消将无法继续操作）',
            initial: true
        })

        if (!jump) {
            throw new CloudBaseError('init 操作终止，请开通云开发服务后再进行操作！')
        }

        // 打开控制台
        open(consoleUrl)
        logger.success('已打开云开发控制台，请登录并在云开发控制台中开通服务！')

        await execWithLoading(() => waitForServiceEnable(), {
            startTip: '等待云开发服务开通中',
            successTip: '云开发服务开通成功！'
        })

        // 返回一个是否刚初始化服务的标志
        return true
    }

    return false
}

// 检查环境的状态，是否可以正常使用
export async function checkEnvStatus(envId: string) {
    const env = await getEnvInfo(envId)
    if (env.Status === ENV_STATUS.UNAVAILABLE) {
        await checkEnvAvaliable(envId)
    } else if (env.Status !== ENV_STATUS.NORMAL) {
        throw new CloudBaseError('所有环境状态异常')
    }
}

// 检测环境是否可用
export async function checkEnvAvaliable(envId: string) {
    let count = 0

    await execWithLoading(
        (flush) => {
            const increase = setInterval(() => {
                flush(`${ENV_INIT_TIP}  ${++count}S`)
            }, 1000)

            return new Promise<void>((resolve) => {
                const timer = setInterval(async () => {
                    const env = await getEnvInfo(envId)
                    // 环境初始化中
                    if (env.Status === ENV_STATUS.NORMAL) {
                        clearInterval(timer)
                        clearInterval(increase)
                        resolve()
                    }
                }, 3000)
            })
        },
        {
            startTip: ENV_INIT_TIP,
            successTip: `环境 ${envId} 初始化成功`
        }
    )
}

// 等待服务开通
async function waitForServiceEnable() {
    return new Promise<void>((resolve) => {
        const timer = setInterval(async () => {
            const app = await getMangerService()
            try {
                const { Initialized } = await app.env.checkTcbService()
                if (Initialized) {
                    clearInterval(timer)
                    setTimeout(() => {
                        // 服务初始化完成到环境创建完成有一定的延迟时间，延迟 5S 返回
                        resolve()
                    }, 5000)
                }
            } catch (e) {
                // 忽略 CAM 权限问题
                if (!isCamRefused(e)) {
                    throw e
                }
            }
        }, 3000)
    })
}
