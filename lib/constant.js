"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALL_COMMANDS = exports.STATUS_TEXT = exports.REQUEST_TIMEOUT = exports.DefaultCloudBaseConfig = exports.DefaultFunctionDeployConfig = exports.ConfigItems = void 0;
class ConfigItems {
}
exports.ConfigItems = ConfigItems;
ConfigItems.credential = 'credential';
ConfigItems.ssh = 'ssh';
exports.DefaultFunctionDeployConfig = {
    timeout: 3,
    handler: 'index.main',
    runtime: 'Nodejs10.15',
    installDependency: true,
    ignore: ['node_modules', 'node_modules/**/*', '.git']
};
exports.DefaultCloudBaseConfig = {
    functionRoot: './functions',
    functions: []
};
exports.REQUEST_TIMEOUT = 30000;
exports.STATUS_TEXT = {
    UNAVAILABLE: '创建中',
    NORMAL: '正常',
    ISOLATE: '隔离中',
    ABNORMAL: '异常',
    ERROR: '异常'
};
exports.ALL_COMMANDS = [
    'login',
    'logout',
    'init',
    'open',
    'env list',
    'env rename',
    'env create',
    'env domain list',
    'env domain create',
    'env domain delete',
    'env login list',
    'env login create',
    'env login update',
    'functions list',
    'functions download',
    'functions deploy',
    'functions delete',
    'functions detail',
    'functions code update',
    'functions config update',
    'functions copy',
    'functions log',
    'functions trigger create',
    'functions trigger delete',
    'functions invoke',
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
    'access domain list'
];
