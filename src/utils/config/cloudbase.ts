import { loadConfig } from './cosmiconfig'
import { ICloudBaseConfig } from '../../types'
import { CloudBaseError } from '../../error'

const DefaultFunctionDeployOptions = {
    timeout: 5,
    runtime: 'Nodejs8.9',
    handler: 'index.main'
}

const DefaultCloudBaseConfig = {
    functionRoot: './functions',
    functions: []
}

/**
 * 从配置文件中解析 cloudbase 配置
 */
export async function resolveCloudBaseConfig(configPath = ''): Promise<ICloudBaseConfig> {
    const oldTcbConfig = await loadConfig({
        moduleName: 'tcb'
    })
    // 检查旧的配置文件
    if (oldTcbConfig) {
        throw new CloudBaseError('tcbrc.json 配置文件已废弃，请使用 cloudbaserc 配置文件！')
    }

    // 可能为 null
    const localCloudBaseConfig = await loadConfig({
        configPath
    })

    if (localCloudBaseConfig && !localCloudBaseConfig.envId) {
        throw new CloudBaseError('无效的配置文件，配置文件必须包含含环境 Id')
    }

    const cloudbaseConfig: ICloudBaseConfig = {
        ...DefaultCloudBaseConfig,
        ...localCloudBaseConfig
    }

    // 兼容不同形式的配置
    cloudbaseConfig.functions = cloudbaseConfig.functions.map(func => {
        if ((func as any).config) {
            return {
                ...func,
                ...(func as any).config
            }
        } else {
            return func
        }
    })

    return cloudbaseConfig
}

// 从命令行和配置文件中获取 envId
export async function getEnvId(commandOptions): Promise<string> {
    const envId = commandOptions?.envId
    const configPath = commandOptions?.parent?.configFile

    const cloudbaseConfig = await resolveCloudBaseConfig(configPath)
    // 命令行 envId 可以覆盖配置文件 envId
    const assignEnvId = envId || cloudbaseConfig.envId
    return assignEnvId
}
