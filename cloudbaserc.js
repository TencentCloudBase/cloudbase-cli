module.exports = {
    envId: 'cli-8gf0zyrc34d4767d',
    //envId: 'tcli',
    functionRoot: './cloudbase/functions',
    functions: [
        {
            name: 'notify',
            // 超时时间
            timeout: 3,
            // 环境变量
            // envVariables: {},
            runtime: 'Nodejs8.9',
            handler: 'index.main',
            installDependency: true
        },
        {
            name: 'agree',
            // 超时时间
            timeout: 3,
            // 环境变量
            // envVariables: {},
            runtime: 'Nodejs8.9',
            handler: 'index.main',
            installDependency: true
        },
        {
            name: 'usage',
            // 超时时间
            timeout: 3,
            // 环境变量
            // envVariables: {},
            runtime: 'Nodejs8.9',
            handler: 'index.main',
            installDependency: true
        },
        {
            name: 'config',
            // 超时时间
            timeout: 8,
            // 环境变量
            // envVariables: {},
            runtime: 'Nodejs8.9',
            handler: 'index.main',
            installDependency: true
        },
        {
            name: 'app',
            // 超时时间
            timeout: 8,
            // 环境变量
            // envVariables: {},
            runtime: 'Nodejs8.9',
            triggers: [
                {
                    // name: 触发器的名字
                    name: 'myTrigger',
                    // type: 触发器类型，目前仅支持 timer （即定时触发器）
                    type: 'timer',
                    // config: 触发器配置，在定时触发器下，config 格式为 cron 表达式
                    config: '0 0 2 1 * * *'
                }
            ],
            handler: 'index.main'
        }
    ]
}
