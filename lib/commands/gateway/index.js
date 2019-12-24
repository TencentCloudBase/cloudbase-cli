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
            throw new error_1.CloudBaseError('未识别到有效的环境 Id 变量，请在项目根目录进行操作或通过 -e 参数指定环境 Id');
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
        cmd: 'service:create',
        options: [
            {
                flags: '-e, --envId [envId]',
                desc: '环境 Id'
            },
            {
                flags: '-p, --service-path <servicePath>',
                desc: 'Service Path'
            },
            {
                flags: '-f, --function <function>',
                desc: '创建云函数HTTP service'
            }
        ],
        desc: '创建HTTP service',
        handler: (options) => __awaiter(void 0, void 0, void 0, function* () {
            const { parent: { configFile }, envId } = options;
            const ctx = yield getGatewayContext(envId, configFile);
            yield create_1.createGw(ctx, options);
        })
    },
    {
        cmd: 'service:delete',
        options: [
            {
                flags: '-e, --envId [envId]',
                desc: '环境 Id'
            },
            {
                flags: '-p, --service-path <servicePath>',
                desc: 'Service Path'
            },
            {
                flags: '-i, --service-id <serviceId>',
                desc: 'Service Id'
            }
        ],
        desc: '删除HTTP service',
        handler: (options) => __awaiter(void 0, void 0, void 0, function* () {
            const { parent: { configFile }, envId } = options;
            const ctx = yield getGatewayContext(envId, configFile);
            yield delete_1.deleteGw(ctx, options);
        })
    },
    {
        cmd: 'service:list',
        options: [
            {
                flags: '-e, --envId [envId]',
                desc: '环境 Id'
            },
            {
                flags: '-d, --domain <domain>',
                desc: '域名'
            },
            {
                flags: '-p, --service-path <servicePath>',
                desc: 'Service Path'
            },
            {
                flags: '-i, --service-id <serviceId>',
                desc: 'Service Id'
            }
        ],
        desc: '查询HTTP service',
        handler: (options) => __awaiter(void 0, void 0, void 0, function* () {
            const { parent: { configFile }, envId } = options;
            const ctx = yield getGatewayContext(envId, configFile);
            yield query_1.queryGw(ctx, options);
        })
    },
    {
        cmd: 'service:domain:bind <domain>',
        options: [
            {
                flags: '-e, --envId [envId]',
                desc: '环境 Id'
            }
        ],
        desc: '绑定HTTP service域名',
        handler: (domain, options) => __awaiter(void 0, void 0, void 0, function* () {
            const { parent: { configFile }, envId } = options;
            const ctx = yield getGatewayContext(envId, configFile);
            yield domain_bind_1.bindGwDomain(ctx, domain);
        })
    },
    {
        cmd: 'service:domain:unbind <domain>',
        options: [
            {
                flags: '-e, --envId [envId]',
                desc: '环境 Id'
            }
        ],
        desc: '解绑HTTP service域名',
        handler: (domain, options) => __awaiter(void 0, void 0, void 0, function* () {
            const { parent: { configFile }, envId } = options;
            const ctx = yield getGatewayContext(envId, configFile);
            yield domain_unbind_1.unbindGwDomain(ctx, domain);
        })
    },
    {
        cmd: 'service:domain:list',
        options: [
            {
                flags: '-e, --envId [envId]',
                desc: '环境 Id'
            },
            {
                flags: '-d, --domain <domain>',
                desc: '域名'
            }
        ],
        desc: '查询HTTP service域名',
        handler: (options) => __awaiter(void 0, void 0, void 0, function* () {
            const { parent: { configFile }, envId } = options;
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
