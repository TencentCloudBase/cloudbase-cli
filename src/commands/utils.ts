import { safeReadJSON } from '@cloudbase/iac-core/lib/src/fs'
import { pathExists, readdir } from 'fs-extra'
import inquirer from 'inquirer'
import { sortBy } from 'lodash'
import { Logger } from '../decorators'
import { listEnvs } from '../env'
import { authSupevisor, getPrivateSettings, loadingFactory } from '../utils'
import { EnvStatus } from './constants'

/**
 * 选择环境
 * @returns
 */
export async function selectEnv(options: { source?: string[] } = {}): Promise<string> {
    const loading = loadingFactory()
    const { source = [] } = options

    loading.start('获取环境列表中...')
    let data = await listEnvs({ source }).finally(() => {
        loading.stop()
    })

    const choices = sortBy(data, ['Alias']).map((item) => {
        return {
            name: `${item.Alias || item.EnvId} (${item.EnvId}) ${
                item.Status === EnvStatus.NORMAL ? '正常' : '不可用'
            }`,
            value: item.EnvId
        }
    })

    const questions = [
        {
            type: 'list',
            name: 'env',
            message: '请选择环境',
            choices: choices
        }
    ]
    const answers = await inquirer.prompt(questions)
    return answers['env'] as string
}

/**
 * 获取 package.json 中的 name 字段的值
 * @param pkgPath
 * @returns 返回值为 { fullName: string, shortName: string }
 */
export async function getPackageJsonName(pkgPath: string) {
    const pkg = await safeReadJSON(pkgPath)
    const parts = pkg.name?.split('/') || []
    const pkgName = parts.length > 1 ? parts[parts.length - 1] : parts[0]
    return {
        fullName: pkg.name,
        shortName: pkgName
    }
}

/**
 * 检查目录是否为空或不存在
 * @param dirPath 目录路径
 * @returns 返回值为 true 表示目录为空或不存在
 */
export async function isDirectoryEmptyOrNotExists(dirPath: string): Promise<boolean> {
    try {
        // 检查目录是否存在
        const exists = await pathExists(dirPath)
        if (!exists) {
            return true
        }

        // 读取目录内容
        const files = await readdir(dirPath)
        return files.length === 0
    } catch (error) {
        return true
    }
}

/**
 * 用于处理 track 回调函数
 */
export function trackCallback(message: any, log: Logger) {
    if (message.type === 'error') {
        log.error(message.details)
    } else {
        log.info(message.details)
    }
}

/**
 * 获取认证信息
 */
export async function getCredential(ctx: any, options: any) {
    let credential
    if (ctx.hasPrivateSettings) {
        process.env.IS_PRIVATE = 'true'
        const privateSettings = getPrivateSettings(ctx.config, options.cmd)
        credential = privateSettings?.credential
    } else {
        credential = await authSupevisor.getLoginState()
    }
    return credential
}
