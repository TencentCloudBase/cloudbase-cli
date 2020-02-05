import tabtab from 'tabtab'

const ALL_COMMANDS = [
    'login',
    'logout',
    'init',
    'open',
    'completion:install',
    'completion:uninstall',
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

const completion = env => {
    if (!env.complete) return

    // 命令
    const args = process.argv.slice(5)
    const cmd = args[0]

    const commands = ALL_COMMANDS.filter(item => item.indexOf(cmd) > -1)
    if (commands.length > 0) {
        return tabtab.log(commands)
    } else {
        return tabtab.log(['-h', '-v'])
    }
}

export function handleCompletion() {
    const env = tabtab.parseEnv(process.env)
    completion(env)
}
