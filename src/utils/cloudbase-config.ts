import fs from 'fs'
import path from 'path'
import { authStore } from './store'
import { IConfig, CloudBaseConfig } from '../types'
import { CloudBaseError } from '../error'

const DefaultFunctionDeployOptions = {
    config: {
        timeout: 5,
        runtime: 'Nodejs8.9'
    },
    handler: 'index.main'
}

const DefaultCloudBaseConfig = {
    functionRoot: './functions',
    functions: []
}

// 获取 cloudbase 存储在本地的配置
export function getCloudBaseConfig(): Promise<IConfig> {
    return authStore.all()
}

/**
 * 获取 cloudbase 配置文件，支持相对路径/绝对路径
 * 1. cloudbaserc.js 文件
 * 2. cloudbaserc.json 文件
 * 3. 指定配置文件
 * @param configPath
 */
export async function resolveCloudBaseConfig(
    configPath = ''
): Promise<CloudBaseConfig> {
    const tcbrcPath = path.resolve('tcbrc.json')
    if (fs.existsSync(tcbrcPath)) {
        throw new CloudBaseError(
            'tcbrc.json 配置文件已废弃，请使用 cloudbaserc.json 或 cloudbaserc.js 配置文件！'
        )
    }
    // 支持 JS 和 JSON 配置语法
    const cloudbaseJSONPath = path.resolve('cloudbaserc.json')
    const cloudbaseJSPath = path.resolve('cloudbaserc.js')
    // 只有 configPath 不为空时才解析，防止解析到文件夹
    const customConfigPath = (configPath && path.resolve(configPath)) || null

    const cloudbasePath = [
        customConfigPath,
        cloudbaseJSPath,
        cloudbaseJSONPath
    ].find(item => item && fs.existsSync(item))
    // 检查配置文件路径
    if (
        !cloudbasePath ||
        !fs.existsSync(cloudbasePath) ||
        !cloudbasePath.match(/.js$|.json$/g)
    ) {
        return {}
    }
    const localCloudBaseConfig = await import(cloudbasePath)
    if (!localCloudBaseConfig.envId) {
        throw new CloudBaseError('配置文件无效，配置文件必须包含含环境 Id')
    }

    const cloudbaseConfig = {
        ...DefaultCloudBaseConfig,
        ...localCloudBaseConfig
    }

    // 为每个函数添加默认配置
    cloudbaseConfig.functions = cloudbaseConfig.functions.map(config => ({
        ...DefaultFunctionDeployOptions,
        ...config
    }))

    return cloudbaseConfig
}

// 从命令行和配置文件中获取 envId
export async function getEnvId(
    envId?: string,
    configPath?: string
): Promise<string> {
    const cloudbaseConfig = await resolveCloudBaseConfig(configPath)
    // 命令行 envId 可以覆盖配置文件 envId
    const assignEnvId = envId || cloudbaseConfig.envId
    if (!assignEnvId) {
        throw new CloudBaseError(
            '未识别到有效的环境 Id 变量，请在项目根目录进行操作或通过 envId 参数指定环境 Id'
        )
    }
    return assignEnvId
}
