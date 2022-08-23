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
export const REQUEST_TIMEOUT = 15000

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
    'env list',
    'env rename',
    'env domain list',
    'env domain create',
    'env domain delete',
    'env login list',
    'env login create',
    'env login update',
    'fn list',
    'fn download',
    'fn deploy',
    'fn delete',
    'fn detail',
    'fn code update',
    'fn config update',
    'fn copy',
    'fn log',
    'fn trigger create',
    'fn trigger delete',
    'fn invoke',
    'fn publish-version',
    'fn list-function-versions',
    'fn put-provisioned-concurrency',
    'fn get-provisioned-concurrency',
    'fn delete-provisioned-concurrency',
    'fn config-route',
    'functions run',
    'storage upload',
    'storage download',
    'storage delete',
    'storage list',
    'storage url',
    'storage detail',
    'storage get-acl',
    'storage set-acl',
    'hosting detail',
    'hosting deploy',
    'hosting delete',
    'hosting list',
    'access create',
    'access delete',
    'access list',
    'access domain bind',
    'access domain unbind',
    'access domain list',
    'run standalonegateway create',
    'run standalonegateway list',
    'run standalonegateway destroy',
    'run standalonegateway package list',
    'run standalonegateway turn on',
    'run standalonegateway turn off',
    'run:deprecated list',
    'run:deprecated delete',
    'run:deprecated version list',
    'run:deprecated version create',
    'run:deprecated version modify',
    'run:deprecated version delete',
    'run:deprecated version update',
    'run:deprecated image list',
    'run:deprecated image upload',
    'run:deprecated image download',
    'run:deprecated image delete',
    'run service:list',
    'run service:deploy',
    'run deploy',
    'run service:config'
]

export const StatusMap = {
    Active: '部署完成',
    Creating: '创建中',
    CreateFailed: '创建失败',
    Updating: '更新中',
    UpdateFailed: '更新失败',
    Publishing: '函数版本发布中',
    PublishFailed: '函数版本发布失败',
    Deleting: '函数删除中',
    DeleteFailed: '函数删除失败'
}

export const ConcurrencyTaskStatus = {
    Done: '已完成',
    InProgress: '进行中',
    Failed: '失败'
}

export const enum EnumEnvCheck {
    EnvFit = 0,
    EnvNewCmdOld,
    EnvOldCmdNew,
}

export const enum EnumDeployStatus {
    Deploying = 'deploying',
    DeploySuccess = 'running',
    DeployFailed = 'deploy_failed'
}

// tcbr 服务配置 cpu 和 mem 的约束
export const CPU_MEM_OPTS: { cpu: number; mems: number[] }[] = [
    { cpu: 0.25, mems: [0.5] },
    { cpu: 0.5, mems: [1] },
    { cpu: 1, mems: [2] },
    { cpu: 2, mems: [4] },
    { cpu: 4, mems: [8] },
    { cpu: 8, mems: [16] },
    { cpu: 16, mems: [32] },
]

export const DEFAULT_CPU_MEM_SET: { PolicyType: 'mem' | 'cpu', PolicyThreshold: number }[] = [
    {
        PolicyType: 'mem',
        PolicyThreshold: 60
    },
    {
        PolicyType: 'cpu',
        PolicyThreshold: 60
    },
]

export enum EnvType {
    BAAS = 'baas',
    RUN = 'run',
    HOTING = 'hoting',
    WEDA = 'weda'
}
