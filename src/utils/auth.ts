import arg from 'arg'
import path from 'path'
import { AuthSupevisor, resolveCloudBaseConfig } from '@cloudbase/toolbox'
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

export const getCloudBaseConfig = async (configPath?: string) => {
    const args = getArgs()
    const assignConfigPath = configPath || args['--config-path'] || process.cwd()

    const projectPath = path.resolve(assignConfigPath)
    const config = await resolveCloudBaseConfig({
        searchFrom: projectPath
    })
    return config
}

export const authSupevisor = AuthSupevisor.getInstance({
    proxy: getProxy(),
    cache: true
})

export async function getLoginState() {
    return authSupevisor.getLoginState()
}
