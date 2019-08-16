"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = __importDefault(require("commander"));
const inquirer_1 = __importDefault(require("inquirer"));
const chalk_1 = __importDefault(require("chalk"));
const error_1 = require("../error");
const function_1 = require("../function");
const utils_1 = require("../utils");
const logger_1 = require("../logger");
async function getConfigFunctions() {
    const config = await utils_1.resolveTcbrcConfig();
    if (!config.functions ||
        !Array.isArray(config.functions) ||
        !config.functions.length) {
        throw new error_1.TcbError('函数配置不存在');
    }
    const { functions } = config;
    functions.forEach(func => {
        if (!func.name) {
            throw new error_1.TcbError('云函数名称不能为空');
        }
        if (typeof func.config.timeout !== 'undefined') {
            const timeout = Number(func.config.timeout);
            if (!Number.isInteger(timeout)) {
                throw new error_1.TcbError('超时时间必需为整数');
            }
            if (timeout < 1 || timeout > 20) {
                throw new error_1.TcbError('超时时间有效值为： 1~20S');
            }
        }
    });
    return functions;
}
commander_1.default
    .command('functions:deploy [functionName] [envId]')
    .option('--force', '如果存在同名函数，上传后覆盖同名函数')
    .description('创建云函数')
    .action(async function (name, envId, options) {
    const assignEnvId = await utils_1.getEnvId(envId);
    const functions = await getConfigFunctions();
    const { force } = options;
    let isBatchCreating = false;
    if (!name) {
        const { isBatch } = await inquirer_1.default.prompt({
            type: 'confirm',
            name: 'isBatch',
            message: '没有指定部署函数，是否部署配置文件中的全部函数？',
            default: false
        });
        isBatchCreating = isBatch;
        if (!isBatchCreating) {
            throw new error_1.TcbError('请指定部署函数名称！');
        }
    }
    if (isBatchCreating) {
        return await function_1.batchCreateFunctions({
            functions,
            root: process.cwd(),
            envId: assignEnvId,
            force
        });
    }
    const newFunction = functions.find(item => item.name === name);
    if (!newFunction || !newFunction.name) {
        throw new error_1.TcbError(`函数 ${name} 配置不存在`);
    }
    try {
        await function_1.createFunction({
            func: newFunction,
            root: process.cwd(),
            envId: assignEnvId,
            force
        });
    }
    catch (e) {
        if (e.code === 'ResourceInUse.FunctionName') {
            const { force } = await inquirer_1.default.prompt({
                type: 'confirm',
                name: 'force',
                message: '存在同名云函数，是否覆盖',
                default: false
            });
            if (force) {
                function_1.createFunction({
                    func: newFunction,
                    root: process.cwd(),
                    envId: assignEnvId,
                    force: true
                });
                return;
            }
        }
        throw e;
    }
});
commander_1.default
    .command('functions:code:update <functionName> [envId]')
    .description('创建云函数')
    .action(async function (name, envId) {
    const assignEnvId = await utils_1.getEnvId(envId);
    const functions = await getConfigFunctions();
    if (!name) {
        throw new error_1.TcbError('请指定函数名称！');
    }
    const newFunction = functions.find(item => item.name === name);
    if (!newFunction || !newFunction.name) {
        throw new error_1.TcbError(`函数 ${name} 配置不存在`);
    }
    await function_1.updateFunctionCode({
        func: newFunction,
        root: process.cwd(),
        envId: assignEnvId
    });
});
commander_1.default
    .command('functions:list [envId]')
    .option('-l, --limit <limit>', '返回数据长度，默认值为 20')
    .option('-o, --offset <offset>', '数据偏移量，默认值为 0')
    .description('展示云函数列表')
    .action(async function (envId, options) {
    let { limit = 20, offset = 0 } = options;
    limit = Number(limit);
    offset = Number(offset);
    if (!Number.isInteger(limit) || !Number.isInteger(offset)) {
        throw new error_1.TcbError('limit 和 offset 必须为整数');
    }
    if (limit < 0 || offset < 0) {
        throw new error_1.TcbError('limit 和 offset 必须为大于 0 的整数');
    }
    const assignEnvId = await utils_1.getEnvId(envId);
    const data = await function_1.listFunction({
        limit: Number(limit),
        offset: Number(offset),
        envId: assignEnvId
    });
    const head = ['Name', 'Runtime', 'AddTime', 'Description'];
    const tableData = data.map(item => {
        const { FunctionName, Runtime, AddTime, Description } = item;
        return [FunctionName, Runtime, AddTime, Description];
    });
    utils_1.printCliTable(head, tableData);
});
commander_1.default
    .command('functions:delete [functionName] [envId]')
    .description('删除云函数')
    .action(async function (name, envId) {
    const assignEnvId = await utils_1.getEnvId(envId);
    let isBatchDelete = false;
    if (!name) {
        const answer = await inquirer_1.default.prompt({
            type: 'confirm',
            name: 'isBatch',
            message: '无云函数名称，是否需要删除配置文件中的全部云函数？',
            default: false
        });
        if (answer.isBatch) {
            const { reConfirm } = await inquirer_1.default.prompt({
                type: 'confirm',
                name: 'reConfirm',
                message: '确定要删除配置文件中的全部云函数？',
                default: false
            });
            isBatchDelete = reConfirm;
        }
        if (!isBatchDelete) {
            throw new error_1.TcbError('请指定需要删除的云函数名称！');
        }
    }
    if (isBatchDelete) {
        const functions = await getConfigFunctions();
        const names = functions.map(item => item.name);
        return await function_1.batchDeleteFunctions({
            names,
            envId: assignEnvId
        });
    }
    await function_1.deleteFunction({
        functionName: name,
        envId: assignEnvId
    });
});
function logDetail(info, name) {
    const ResMap = {
        Status: '状态',
        CodeSize: '代码大小',
        Description: '描述',
        Environment: '环境变量(key=value)',
        FunctionName: '函数名称',
        FunctionVersion: '函数版本',
        Handler: '执行方法',
        MemorySize: '内存配置(MB)',
        ModTime: '修改时间',
        Namespace: '环境 Id',
        Runtime: '运行环境',
        Timeout: '超时时间(S)',
        VpcConfig: '网络配置',
        Triggers: '触发器',
        CodeInfo: '函数代码'
    };
    const funcInfo = Object.keys(ResMap)
        .map(key => {
        if (key === 'Environment') {
            const data = info[key].Variables.map(item => `${item.Key}=${item.Value}`).join('; ');
            return `${ResMap[key]}：${data} \n`;
        }
        if (key === 'Triggers') {
            let data = info[key]
                .map(item => `${item.TriggerName}：${item.TriggerDesc}`)
                .join('\n');
            data = data.length ? `${data}\n` : '无';
            return `${ResMap[key]}：\n${data}`;
        }
        if (key === 'VpcConfig') {
            const { vpc, subnet } = info[key];
            if (vpc && subnet) {
                return `${ResMap[key]}：${vpc.VpcId}(${vpc.VpcName} | ${subnet.CidrBlock}) / ${subnet.SubnetId}(${subnet.SubnetName})\n`;
            }
            else {
                return `${ResMap[key]}：无\n`;
            }
        }
        if (key === 'CodeInfo') {
            return `${ResMap[key]}：\n${info[key]}`;
        }
        return `${ResMap[key]}：${info[key]} \n`;
    })
        .reduce((prev, next) => prev + next);
    console.log(chalk_1.default.green(`函数 [${name}] 信息：`) + '\n\n' + funcInfo);
}
commander_1.default
    .command('functions:detail [functionName] [envId]')
    .description('获取云函数信息')
    .action(async function (name, envId) {
    const assignEnvId = await utils_1.getEnvId(envId);
    if (!name) {
        const functions = await getConfigFunctions();
        const names = functions.map(item => item.name);
        const data = await function_1.batchGetFunctionsDetail({
            names,
            envId: assignEnvId
        });
        data.forEach(info => logDetail(info, name));
        return;
    }
    const data = await function_1.getFunctionDetail({
        functionName: name,
        envId: assignEnvId
    });
    logDetail(data, name);
});
commander_1.default
    .command('functions:log <functionName> [envId]')
    .description('打印云函数日志')
    .option('-i, --reqId <reqId>', '函数请求 Id')
    .option('-o, --offset <offset>', '数据的偏移量，Offset + Limit不能大于10000')
    .option('-l, --limit <limit>', '返回数据的长度，Offset + Limit不能大于10000')
    .option('--order <order>', '以升序还是降序的方式对日志进行排序，可选值 desc 和 asc')
    .option('--orderBy <orderBy>', '根据某个字段排序日志,支持以下字段：function_name, duration, mem_usage, start_time')
    .option('--startTime <startTime>', '查询的具体日期，例如：2019-05-16 20:00:00，只能与 endtime 相差一天之内')
    .option('--endTime <endTime>', '查询的具体日期，例如：2019-05-16 20:59:59，只能与 startTime 相差一天之内')
    .option('-e, --error', '只返回错误类型的日志')
    .option('-s, --success', '只返回正确类型的日志')
    .action(async function (name, envId, options) {
    const assignEnvId = await utils_1.getEnvId(envId);
    let { offset, limit, order, orderBy, error, success, startTime, endTime, reqId: functionRequestId } = options;
    if (!name) {
        throw new error_1.TcbError('云函数名称不能为空');
    }
    const TimeLength = 19;
    if (typeof startTime !== 'undefined' &&
        typeof endTime !== 'undefined' &&
        (startTime.length !== TimeLength || endTime.length !== TimeLength)) {
        throw new error_1.TcbError('时间格式错误，必须为 2019-05-16 20:59:59 类型');
    }
    if (new Date(endTime).getTime() < new Date(startTime).getTime()) {
        throw new error_1.TcbError('开始时间不能晚于结束时间');
    }
    const OneDay = 86400000;
    if (new Date(endTime).getTime() - new Date(startTime).getTime() >
        OneDay) {
        throw new error_1.TcbError('endTime 与 startTime 只能相差一天之内');
    }
    let params = {
        offset,
        limit,
        order,
        orderBy,
        startTime,
        endTime,
        functionRequestId
    };
    error && (params.filter = { RetCode: 'not0' });
    success && (params.filter = { RetCode: 'is0' });
    params = JSON.parse(JSON.stringify(params));
    const logs = await function_1.getFunctionLog(Object.assign({ functionName: name, envId: assignEnvId }, params));
    const ResMap = {
        StartTime: '请求时间',
        FunctionName: '函数名称',
        BillDuration: '计费时间(ms)',
        Duration: '运行时间(ms)',
        InvokeFinished: '调用次数',
        MemUsage: '占用内存',
        RequestId: '请求 Id',
        RetCode: '调用状态',
        RetMsg: '返回结果'
    };
    console.log(chalk_1.default.green(`函数：${name} 调用日志：`) + '\n\n');
    if (logs.length === 0) {
        return console.log('无调用日志');
    }
    logs.forEach(log => {
        const info = Object.keys(ResMap)
            .map(key => {
            if (key === 'RetCode') {
                return `${ResMap[key]}：${Number(log[key]) === 0 ? '成功' : '失败'}\n`;
            }
            if (key === 'MemUsage') {
                const str = Number(Number(log[key]) / 1024 / 1024).toFixed(3);
                return `${ResMap[key]}：${str} MB\n`;
            }
            return `${ResMap[key]}：${log[key]} \n`;
        })
            .reduce((prev, next) => prev + next);
        console.log(info + `日志：\n ${log.Log} \n`);
    });
});
commander_1.default
    .command('functions:config:update [functionName] [envId]')
    .description('更新云函数配置')
    .action(async function (name, envId) {
    const assignEnvId = await utils_1.getEnvId(envId);
    let isBathUpdate = false;
    if (!name) {
        const { isBatch } = await inquirer_1.default.prompt({
            type: 'confirm',
            name: 'isBatch',
            message: '无云函数名称，是否需要更新配置文件中的【全部云函数】的配置？',
            default: false
        });
        isBathUpdate = isBatch;
        if (!isBathUpdate) {
            throw new error_1.TcbError('请指定云函数名称！');
        }
    }
    const functions = await getConfigFunctions();
    if (isBathUpdate) {
        await function_1.batchUpdateFunctionConfig({
            functions,
            envId: assignEnvId
        });
        logger_1.successLog('更新云函数配置成功！');
        return;
    }
    const functionItem = functions.find(item => item.name === name);
    if (!functionItem) {
        throw new error_1.TcbError('未找到相关函数配置，请检查函数名是否正确');
    }
    await function_1.updateFunctionConfig({
        functionName: name,
        config: functionItem.config,
        envId: assignEnvId
    });
    logger_1.successLog('更新云函数配置成功！');
});
commander_1.default
    .command('functions:trigger:create [functionName] [envId]')
    .description('创建云函数触发器')
    .action(async function (name, envId) {
    const assignEnvId = await utils_1.getEnvId(envId);
    let isBatchCreateTrigger = false;
    if (!name) {
        const { isBatch } = await inquirer_1.default.prompt({
            type: 'confirm',
            name: 'isBatch',
            message: '无云函数名称，是否需要部署配置文件中的【全部云函数】的全部触发器？',
            default: false
        });
        isBatchCreateTrigger = isBatch;
        if (!isBatchCreateTrigger) {
            throw new error_1.TcbError('请指定云函数名称！');
        }
    }
    const functions = await getConfigFunctions();
    if (isBatchCreateTrigger) {
        return await function_1.batchCreateTriggers({
            functions,
            envId: assignEnvId
        });
    }
    const functionItem = functions.find(item => item.name === name);
    if (!functionItem) {
        throw new error_1.TcbError('未找到相关函数配置，请检查函数名是否正确');
    }
    const { triggers } = functionItem;
    if (!triggers || !triggers.length) {
        throw new error_1.TcbError('触发器配置不能为空');
    }
    await function_1.createFunctionTriggers({
        functionName: name,
        triggers,
        envId: assignEnvId
    });
});
commander_1.default
    .command('functions:trigger:delete [functionName] [triggerName] [envId]')
    .description('删除云函数触发器')
    .action(async function (functionName, triggerName, envId) {
    const assignEnvId = await utils_1.getEnvId(envId);
    let isBtachDeleteTriggers;
    let isBatchDeleteFunctionTriggers = false;
    if (!functionName) {
        const answer = await inquirer_1.default.prompt({
            type: 'confirm',
            name: 'isBatch',
            message: '无云函数名称，是否需要删除配置文件中的【全部云函数】的全部触发器？',
            default: false
        });
        if (answer.isBatch) {
            const { reConfirm } = await inquirer_1.default.prompt({
                type: 'confirm',
                name: 'reConfirm',
                message: '确定要删除配置文件中的【全部云函数】的全部触发器？',
                default: false
            });
            isBtachDeleteTriggers = reConfirm;
        }
        if (!isBtachDeleteTriggers) {
            throw new error_1.TcbError('请指定云函数名称以及触发器名称！');
        }
    }
    if (isBtachDeleteTriggers) {
        const functions = await getConfigFunctions();
        return await function_1.batchDeleteTriggers({
            functions,
            envId: assignEnvId
        });
    }
    if (!triggerName && functionName) {
        const { isBatch } = await inquirer_1.default.prompt({
            type: 'confirm',
            name: 'isBatch',
            message: '没有指定触发器名称，是否需要此云函数的全部触发器？',
            default: false
        });
        isBatchDeleteFunctionTriggers = isBatch;
        if (!isBatchDeleteFunctionTriggers) {
            throw new error_1.TcbError('请指定云函数名称以及触发器名称！');
        }
    }
    if (isBatchDeleteFunctionTriggers) {
        const functions = await getConfigFunctions();
        const func = functions.find(item => item.name === functionName);
        return await function_1.batchDeleteTriggers({
            functions: [func],
            envId: assignEnvId
        });
    }
    if (!triggerName) {
        throw new error_1.TcbError('触发器名称不能为空');
    }
    function_1.deleteFunctionTrigger({
        functionName,
        triggerName,
        envId: assignEnvId
    });
});
commander_1.default
    .command('functions:invoke [functionName] [params] [envId]')
    .description('触发云函数')
    .action(async function (name, jsonStringParams, envId) {
    const assignEnvId = await utils_1.getEnvId(envId);
    let isBatchInvoke = false;
    if (!name) {
        const { isBatch } = await inquirer_1.default.prompt({
            type: 'confirm',
            name: 'isBatch',
            message: '无云函数名称，是否需要触发配置文件中的全部云函数？',
            default: false
        });
        isBatchInvoke = isBatch;
        if (!isBatchInvoke) {
            throw new error_1.TcbError('请指定云函数名称！');
        }
    }
    let params;
    if (jsonStringParams) {
        try {
            params = JSON.parse(jsonStringParams);
        }
        catch (e) {
            console.log(e);
            throw new error_1.TcbError('jsonStringParams 参数不是正确的 JSON 字符串');
        }
    }
    const functions = await getConfigFunctions();
    if (isBatchInvoke) {
        return await function_1.batchInvokeFunctions({
            functions,
            envId: assignEnvId
        });
    }
    const func = functions.find(item => item.name === name);
    if (!func) {
        throw new error_1.TcbError('未找到相关函数配置，请检查函数名是否正确');
    }
    await function_1.invokeFunction({
        functionName: name,
        envId: assignEnvId,
        params: params || func.params
    });
});
