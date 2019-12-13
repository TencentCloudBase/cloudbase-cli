"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = __importDefault(require("commander"));
const utils_1 = require("../../utils");
const error_1 = require("../../error");
const create_1 = require("./create");
const delete_1 = require("./delete");
const query_1 = require("./query");
const domain_bind_1 = require("./domain-bind");
const domain_unbind_1 = require("./domain-unbind");
const domain_query_1 = require("./domain-query");
function getGatewayContext(envId, configPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const cloudBaseConfig = yield utils_1.resolveCloudBaseConfig(configPath);
        const assignEnvId = envId || cloudBaseConfig.envId;
        if (!assignEnvId) {
            throw new error_1.CloudBaseError('未识别到有效的环境 Id 变量，请在项目根目录进行操作或通过 envId 参数指定环境 Id');
        }
        const ctx = {
            envId: assignEnvId,
            config: cloudBaseConfig
        };
        return ctx;
    });
}
const commands = [
    {
        cmd: 'gateway:create <gatewayPath> [envId]',
        options: [
            {
                flags: '-f, --function <function>',
                desc: '创建云函数网关.'
            }
        ],
        desc: '创建云函数网关.',
        handler: (gatewayPath, envId, options) => __awaiter(void 0, void 0, void 0, function* () {
            const { configFile } = options.parent;
            const ctx = yield getGatewayContext(envId, configFile);
            yield create_1.createGw(ctx, gatewayPath, options);
        })
    },
    {
        cmd: 'gateway:delete [envId]',
        options: [
            {
                flags: '-p, --gateway-path <gatewayPath>',
                desc: 'API Path'
            },
            {
                flags: '-i, --gateway-id <gatewayId>',
                desc: 'API id'
            }
        ],
        desc: '删除云函数网关.',
        handler: (envId, options) => __awaiter(void 0, void 0, void 0, function* () {
            const { configFile } = options.parent;
            const ctx = yield getGatewayContext(envId, configFile);
            yield delete_1.deleteGw(ctx, options);
        })
    },
    {
        cmd: 'gateway:list [envId]',
        options: [
            {
                flags: '-d, --domain <domain>',
                desc: '域名'
            },
            {
                flags: '-p, --gateway-path <gatewayPath>',
                desc: 'API Path'
            },
            {
                flags: '-i, --gateway-id <gatewayId>',
                desc: 'API id'
            }
        ],
        desc: '查询云函数网关.',
        handler: (envId, options) => __awaiter(void 0, void 0, void 0, function* () {
            const { configFile } = options.parent;
            const ctx = yield getGatewayContext(envId, configFile);
            yield query_1.queryGw(ctx, options);
        })
    },
    {
        cmd: 'gateway:domain:bind <customDomain> [envId]',
        options: [],
        desc: '绑定自定义网关域名.',
        handler: (customDomain, envId, options) => __awaiter(void 0, void 0, void 0, function* () {
            const { configFile } = options.parent;
            const ctx = yield getGatewayContext(envId, configFile);
            yield domain_bind_1.bindGwDomain(ctx, customDomain);
        })
    },
    {
        cmd: 'gateway:domain:unbind <customDomain> [envId]',
        options: [],
        desc: '解绑自定义网关名.',
        handler: (customDomain, envId, options) => __awaiter(void 0, void 0, void 0, function* () {
            const { configFile } = options.parent;
            const ctx = yield getGatewayContext(envId, configFile);
            yield domain_unbind_1.unbindGwDomain(ctx, customDomain);
        })
    },
    {
        cmd: 'gateway:domain:list [envId]',
        options: [
            {
                flags: '-d, --domain <domain>',
                desc: '域名'
            }
        ],
        desc: '查询自定义网关域名.',
        handler: (envId, options) => __awaiter(void 0, void 0, void 0, function* () {
            const { configFile } = options.parent;
            const ctx = yield getGatewayContext(envId, configFile);
            yield domain_query_1.queryGwDomain(ctx, options);
        })
    }
];
commands.forEach(item => {
    let instance = commander_1.default.command(item.cmd);
    item.options.forEach(option => {
        instance = instance.option(option.flags, option.desc);
    });
    instance.description(item.desc);
    instance.action(item.handler);
});
