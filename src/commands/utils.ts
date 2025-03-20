import { sortBy } from 'lodash'
import { listEnvs } from '../env'
import { EnvStatus } from './constants'
import inquirer from 'inquirer'
import { loadingFactory } from '../utils'
import { safeReadJSON } from '@cloudbase/iac-core/lib/src/fs'

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
