"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tabtab_1 = __importDefault(require("tabtab"));
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
];
const completion = env => {
    if (!env.complete)
        return;
    const args = process.argv.slice(5);
    const cmd = args[0];
    const commands = ALL_COMMANDS.filter(item => item.indexOf(cmd) > -1);
    if (commands.length > 0) {
        return tabtab_1.default.log(commands);
    }
    else {
        return tabtab_1.default.log(['-h', '-v']);
    }
};
function handleCompletion() {
    const env = tabtab_1.default.parseEnv(process.env);
    completion(env);
}
exports.handleCompletion = handleCompletion;
