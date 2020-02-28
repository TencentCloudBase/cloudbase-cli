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
Object.defineProperty(exports, "__esModule", { value: true });
const deploy_1 = require("./deploy");
const error_1 = require("../../error");
const code_update_1 = require("./code-update");
const list_1 = require("./list");
const delete_1 = require("./delete");
const detail_1 = require("./detail");
const log_1 = require("./log");
const config_update_1 = require("./config-update");
const trigger_create_1 = require("./trigger-create");
const trigger_delete_1 = require("./trigger-delete");
const invoke_1 = require("./invoke");
const copy_1 = require("./copy");
const code_download_1 = require("./code-download");
const run_1 = require("./run");
const command_1 = require("../command");
const layer_1 = require("./layer");
const commands = [
    {
        cmd: 'functions:list',
        options: [
            {
                flags: '-e, --envId <envId>',
                desc: '环境 Id'
            },
            { flags: '-l, --limit <limit>', desc: '返回数据长度，默认值为 20' },
            {
                flags: '-o, --offset <offset>',
                desc: '数据偏移量，默认值为 0'
            }
        ],
        desc: '展示云函数列表',
        handler: list_1.list
    },
    {
        cmd: 'functions:download <name> [dest]',
        options: [
            {
                flags: '-e, --envId <envId>',
                desc: '环境 Id'
            },
            { flags: '-l, --limit <limit>', desc: '返回数据长度，默认值为 20' },
            {
                flags: '--code-secret <codeSecret>',
                desc: '代码加密的函数的 CodeSecret'
            }
        ],
        desc: '下载云函数代码',
        handler: code_download_1.codeDownload
    },
    {
        cmd: 'functions:deploy [name]',
        options: [
            {
                flags: '-e, --envId <envId>',
                desc: '环境 Id'
            },
            {
                flags: '--code-secret <codeSecret>',
                desc: '传入此参数将保护代码，格式为 36 位大小字母和数字'
            },
            {
                flags: '--force',
                desc: '如果存在同名函数，上传后覆盖同名函数'
            },
            {
                flags: '--verbose',
                desc: '输出云函数部署细节'
            }
        ],
        desc: '部署云函数',
        handler: deploy_1.deploy
    },
    {
        cmd: 'functions:delete [name]',
        options: [
            {
                flags: '-e, --envId <envId>',
                desc: '环境 Id'
            }
        ],
        desc: '删除云函数',
        handler: delete_1.deleteFunc
    },
    {
        cmd: 'functions:detail <name>',
        options: [
            {
                flags: '-e, --envId <envId>',
                desc: '环境 Id'
            },
            {
                flags: '--code-secret <codeSecret>',
                desc: '代码加密的函数的 CodeSecret'
            }
        ],
        desc: '获取云函数信息',
        handler: detail_1.detail
    },
    {
        cmd: 'functions:code:update <name>',
        options: [
            {
                flags: '-e, --envId <envId>',
                desc: '环境 Id'
            },
            {
                flags: '--code-secret <codeSecret>',
                desc: '传入此参数将保护代码，格式为 36 位大小字母和数字'
            }
        ],
        desc: '更新云函数代码',
        handler: code_update_1.codeUpdate
    },
    {
        cmd: 'functions:config:update [name]',
        options: [
            {
                flags: '-e, --envId <envId>',
                desc: '环境 Id'
            }
        ],
        desc: '更新云函数配置',
        handler: config_update_1.configUpdate
    },
    {
        cmd: 'functions:copy <name> [newFunctionName]',
        options: [
            {
                flags: '-e, --envId <envId>',
                desc: '环境 Id'
            },
            {
                flags: '-t, --target <targetEnvId>',
                desc: '目标环境 Id'
            },
            {
                flags: '--force',
                desc: '如果目标环境下存在同名函数，覆盖原函数'
            }
        ],
        desc: '拷贝云函数',
        handler: copy_1.copy
    },
    {
        cmd: 'functions:log <name>',
        options: [
            {
                flags: '-e, --envId <envId>',
                desc: '环境 Id'
            },
            { flags: '-i, --reqId <reqId>', desc: '函数请求 Id' },
            {
                flags: '-o, --offset <offset>',
                desc: '数据的偏移量，Offset + Limit不能大于10000'
            },
            {
                flags: '-l, --limit <limit>',
                desc: '返回数据的长度，Offset + Limit不能大于10000'
            },
            {
                flags: '--order <order>',
                desc: '以升序还是降序的方式对日志进行排序，可选值 desc 和 asc'
            },
            {
                flags: '--orderBy <orderBy>',
                desc: '根据某个字段排序日志,支持以下字段：function_name, duration, mem_usage, start_time'
            },
            {
                flags: '--startTime <startTime>',
                desc: '查询的具体日期，例如：2019-05-16 20:00:00，只能与 endtime 相差一天之内'
            },
            {
                flags: '--endTime <endTime>',
                desc: '查询的具体日期，例如：2019-05-16 20:59:59，只能与 startTime 相差一天之内'
            },
            { flags: '-e, --error', desc: '只返回错误类型的日志' },
            { flags: '-s, --success', desc: '只返回正确类型的日志' }
        ],
        desc: '打印云函数日志',
        handler: log_1.log
    },
    {
        cmd: 'functions:trigger:create [functionName]',
        options: [
            {
                flags: '-e, --envId <envId>',
                desc: '环境 Id'
            }
        ],
        desc: '创建云函数触发器',
        handler: trigger_create_1.triggerCreate
    },
    {
        cmd: 'functions:trigger:delete [functionName] [triggerName]',
        options: [
            {
                flags: '-e, --envId <envId>',
                desc: '环境 Id'
            }
        ],
        desc: '删除云函数触发器',
        handler: trigger_delete_1.triggerDelete
    },
    {
        cmd: 'functions:invoke [name]',
        options: [
            {
                flags: '-e, --envId <envId>',
                desc: '环境 Id'
            },
            {
                flags: '--params <params>',
                desc: '调用函数的入参，JSON 字符串形式'
            }
        ],
        desc: '触发云端部署的云函数',
        handler: invoke_1.invoke
    },
    {
        cmd: 'functions:run',
        options: [
            {
                flags: '--path <path>',
                desc: '云函数路径，使用默认配置直接调用云函数，无需配置文件'
            },
            {
                flags: '--name <name>',
                desc: '指定云函数的名称进行调用，需要配置文件'
            },
            {
                flags: '--params <params>',
                desc: '调用函数传入的参数，JSON 字符串格式'
            },
            {
                flags: '--port <port>',
                desc: '启动调试时监听的端口号，默认为 9229'
            },
            {
                flags: '--debug',
                desc: '启动调试模式'
            }
        ],
        desc: '本地运行云函数（当前仅支持 Node）',
        handler: (ctx) => __awaiter(void 0, void 0, void 0, function* () {
            const { options } = ctx;
            const { path, name } = options;
            if (path) {
                yield run_1.debugFunctionByPath(path, options);
            }
            else if (typeof name === 'string') {
                yield run_1.debugByConfig(ctx, name);
            }
            else {
                throw new error_1.CloudBaseError('请指定运行函数的名称或函数的路径\n\n例如 cloudbase functions:run --name app');
            }
        })
    },
    {
        cmd: 'functions:layer:create <alias>',
        options: [
            {
                flags: '-e, --envId <envId>',
                desc: '环境 Id'
            },
            {
                flags: '--file, <file>',
                desc: '文件路径'
            }
        ],
        desc: '创建函数文件层',
        handler: layer_1.createFileLayer
    },
    {
        cmd: 'functions:layer:list',
        options: [
            {
                flags: '-e, --envId <envId>',
                desc: '环境 Id'
            },
            {
                flags: '--name, <name>',
                desc: '函数名称'
            },
            {
                flags: '--layer, <layer>',
                desc: '文件层别名'
            },
            {
                flags: '--code-secret, <codeSecret>',
                desc: '代码加密的函数的 CodeSecret'
            }
        ],
        desc: '展示文件层列表',
        handler: layer_1.listFileLayer,
        requiredEnvId: false
    },
    {
        cmd: 'functions:layer:bind <name>',
        options: [
            {
                flags: '-e, --envId <envId>',
                desc: '环境 Id'
            },
            {
                flags: '--code-secret, <codeSecret>',
                desc: '代码加密的函数的 CodeSecret'
            }
        ],
        desc: '绑定文件层到云函数',
        handler: layer_1.attachFileLayer
    },
    {
        cmd: 'functions:layer:unbind <name>',
        options: [
            {
                flags: '-e, --envId <envId>',
                desc: '环境 Id'
            },
            {
                flags: '--code-secret, <codeSecret>',
                desc: '代码加密的函数的 CodeSecret'
            }
        ],
        desc: '删除云函数绑定的文件层',
        handler: layer_1.unAttachFileLayer
    },
    {
        cmd: 'functions:layer:download',
        options: [
            {
                flags: '-e, --envId <envId>',
                desc: '环境 Id'
            },
            {
                flags: '--dest <dest>',
                desc: '下载文件存放的地址'
            }
        ],
        desc: '下载云函数文件层',
        handler: layer_1.downloadFileLayer
    },
    {
        cmd: 'functions:layer:sort <name>',
        options: [
            {
                flags: '-e, --envId <envId>',
                desc: '环境 Id'
            },
            {
                flags: '--code-secret, <codeSecret>',
                desc: '代码加密的函数的 CodeSecret'
            }
        ],
        desc: '重新排列云函数绑定的文件层的顺序',
        handler: layer_1.sortFileLayer
    },
    {
        cmd: 'functions:layer:delete',
        options: [
            {
                flags: '-e, --envId <envId>',
                desc: '环境 Id'
            }
        ],
        desc: '删除当前环境的文件层',
        handler: layer_1.deleteFileLayer
    }
];
commands.forEach(item => {
    const command = new command_1.Command(item);
    command.init();
});
