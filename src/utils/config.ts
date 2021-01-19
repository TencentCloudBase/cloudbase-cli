import path from 'path'
import yargs, { Arguments } from 'yargs'
import { ConfigParser, ICloudBaseConfig } from '@cloudbase/toolbox'

export interface IArgs {
    envId: string
    region: string
    verbose: boolean
    configPath: string
    [x: string]: unknown
}

export const getArgs = (): Arguments<IArgs> => {
    // console.log(yargs.argv)
    return yargs.alias('e', 'envId').alias('r', 'region').argv as any
}

// 获取 cloudbase 配置
export const getCloudBaseConfig = async (configPath?: string): Promise<ICloudBaseConfig> => {
    const args = getArgs()

    let specificConfigPath = configPath || args.configPath
    specificConfigPath = specificConfigPath ? path.resolve(specificConfigPath) : undefined

    const parser = new ConfigParser({
        configPath: specificConfigPath
    })
    const config: ICloudBaseConfig = await parser.get()

    // 合并默认配置
    if (config?.functionDefaultConfig && config?.functions?.length) {
        config.functions = config.functions.map((rawConfig) => ({
            ...config.functionDefaultConfig,
            ...rawConfig
        }))
    }

    return config
}
