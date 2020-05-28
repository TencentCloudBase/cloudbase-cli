// cloudbase cli 配置的字段名
export class ConfigItems {
    static credential = 'credential'
    static ssh = 'ssh'
}

// Node.js 默认部署配置
export const DefaultFunctionDeployConfig = {
    timeout: 3,
    handler: 'index.main',
    runtime: 'Nodejs10.15',
    installDependency: true,
    ignore: ['node_modules', 'node_modules/**/*', '.git']
}

// cloudbase 配置文件默认配置
export const DefaultCloudBaseConfig = {
    functionRoot: './functions',
    functions: []
}

// 请求超时时间
export const REQUEST_TIMEOUT = 30000

export const enum ENV_STATUS {
    // 创建中
    UNAVAILABLE = 'UNAVAILABLE',
    // 正常
    NORMAL = 'NORMAL',
    // 销毁隔离
    ISOLATE = 'ISOLATE',
    // 异常
    ABNORMAL = 'ABNORMAL',
    ERROR = 'ERROR'
}

export const STATUS_TEXT = {
    UNAVAILABLE: '创建中',
    NORMAL: '正常',
    ISOLATE: '隔离中',
    ABNORMAL: '异常',
    ERROR: '异常'
}

export const ALL_COMMANDS = [
    'login',
    'logout',
    'init',
    'open',
    'completion:setup',
    'completion:clean',
    'env:list',
    'env:rename',
    'env:create',
    'env:domain:list',
    'env:domain:create',
    'env:domain:delete',
    'env:login:list',
    'env:login:create',
    'env:login:update',
    'functions:list',
    'functions:download',
    'functions:deploy',
    'functions:delete',
    'functions:detail',
    'functions:code:update',
    'functions:config:update',
    'functions:copy',
    'functions:log',
    'functions:trigger:create',
    'functions:trigger:delete',
    'functions:invoke',
    'functions:run',
    'storage:upload',
    'storage:download',
    'storage:delete',
    'storage:list',
    'storage:url',
    'storage:detail',
    'storage:get-acl',
    'storage:set-acl',
    'hosting:detail',
    'hosting:deploy',
    'hosting:delete',
    'hosting:list',
    'server:deploy',
    'server:log',
    'server:reload',
    'server:stop',
    'server:show',
    'service:create',
    'service:delete',
    'service:list',
    'service:domain:bind',
    'service:domain:unbind',
    'service:domain:list'
]
