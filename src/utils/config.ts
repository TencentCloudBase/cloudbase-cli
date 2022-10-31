import _ from 'lodash'
import path from 'path'
import yargs, { Arguments } from 'yargs'
import { ConfigParser, ICloudBaseConfig } from '@cloudbase/toolbox'
import { Credential } from '../types'

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
const hasOwn = (obj: object, name: string): boolean => {
    return Object.prototype.hasOwnProperty.call(obj ?? {}, name)
}

/**
 * 用是否设置privateSettings来决定它是否是私有化环境
 */
export function getPrivateSettings(
    config: ICloudBaseRcSettings,
    cmd?: string
): undefined | IPrivateSettings {
    const commonConfig = config
    const currentConfig = cmd ? config?.[cmd] : config
    if (hasOwn(currentConfig, 'privateSettings') || hasOwn(commonConfig, 'privateSettings')) {
        return { ...commonConfig.privateSettings, ...currentConfig.privateSettings }
    }
    return undefined
}

type IAbsUrl = `http://${string}` | `https://${string}`
/**
 * 私有化配置
 */
export interface IPrivateSettings {
    credential: Credential
    endpoints: {
        editor: IAbsUrl
        cliApi: IAbsUrl
    }
    privateUin: string
}

export interface ICloudBaseRcSettings extends ICloudBaseConfig {
    privateSettings?: IPrivateSettings
}

// 获取 cloudbase 配置
export const getCloudBaseConfig = async (configPath?: string): Promise<ICloudBaseRcSettings> => {
    const args = getArgs()

    let specificConfigPath = configPath || args.configPath
    specificConfigPath = specificConfigPath ? path.resolve(specificConfigPath) : undefined
    const parser = new ConfigParser({
        configPath: specificConfigPath
    })
    const config: ICloudBaseConfig = await parser.get()

    // 合并默认配置
    if (config?.functionDefaultConfig && config?.functions?.length) {
        config.functions = config.functions.map((rawConfig) =>
            _.merge({}, config.functionDefaultConfig, rawConfig)
        )
    }

    return config
}
