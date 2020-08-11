import arg from 'arg'
import path from 'path'
import { AuthSupevisor, ConfigParser, ICloudBaseConfig } from '@cloudbase/toolbox'
import { getProxy } from './tools'

// https://www.npmjs.com/package/arg
export interface IArgs extends arg.Spec {
    '--config-path': string
    '--envId': string
    '-e': string
}

export const getArgs = (): arg.Result<IArgs> => {
    const args = arg<IArgs>(
        {
            '--config-path': String(),
            '--envId': String(),
            '--verbose': String(),

            // Alias
            '-e': '--envId'
        },
        { permissive: true, argv: process.argv.slice(2) }
    )

    return args
}

// 获取 cloudbase 配置
export const getCloudBaseConfig = async (configPath?: string): Promise<ICloudBaseConfig> => {
    const args = getArgs()

    let specificConfigPath = configPath || args['--config-path']
    specificConfigPath = specificConfigPath ? path.resolve(specificConfigPath) : undefined

    const parser = new ConfigParser({
        configPath: specificConfigPath
    })
    const config = await parser.get()
    return config
}

export const authSupevisor = AuthSupevisor.getInstance({
    proxy: getProxy(),
    cache: true
})

export async function getLoginState() {
    return authSupevisor.getLoginState()
}
