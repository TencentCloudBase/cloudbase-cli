/**
 *  项目常量
 */

 // cloudbase cli 配置的字段名
export class ConfigItems {
    static credentail = 'credential'
    static ssh = 'ssh'
}

export const defaultFunctionDeployOptions = {
    config: {
        timeout: 5,
        runtime: 'Nodejs8.9'
    },
    handler: 'index.main'
}

export const DefaultCloudBaseConfig = {
    functionRoot: './functions',
    functions: []
}
