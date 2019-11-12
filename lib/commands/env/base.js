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
const env_1 = require("../../env");
const utils_1 = require("../../utils");
const error_1 = require("../../error");
const logger_1 = require("../../logger");
commander_1.default
    .command('env:list')
    .description('展示云开发环境信息')
    .action(function () {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield env_1.listEnvs();
        const head = [
            'Alias',
            'EnvId',
            'PackageName',
            'Source',
            'CreateTime',
            'Status'
        ];
        const sortData = data.sort((prev, next) => {
            if (prev.Alias > next.Alias) {
                return 1;
            }
            if (prev.Alias < next.Alias) {
                return -1;
            }
            return 0;
        });
        const tableData = sortData.map(item => [
            item.Alias,
            item.EnvId,
            item.PackageName,
            item.Source === 'miniapp' ? '小程序' : '云开发',
            item.CreateTime,
            item.Status === 'NORMAL' ? '正常' : '不可用'
        ]);
        utils_1.printCliTable(head, tableData);
        const unavailableEnv = data.find(item => item.Status === 'UNAVAILABLE');
        if (unavailableEnv) {
            logger_1.warnLog(`您的环境中存在不可用的环境：[${unavailableEnv.EnvId}]，请留意！`);
        }
    });
});
function checkEnvAvailability(envId) {
    return __awaiter(this, void 0, void 0, function* () {
        const MAX_TRY = 10;
        let retry = 0;
        return new Promise((resolve, reject) => {
            const timer = setInterval(() => __awaiter(this, void 0, void 0, function* () {
                const envInfo = yield env_1.getEnvInfo(envId);
                if (envInfo.Status === 'NORMAL') {
                    clearInterval(timer);
                    resolve();
                }
                else {
                    retry++;
                }
                if (retry > MAX_TRY) {
                    reject(new error_1.CloudBaseError('环境初始化查询超时，请稍后通过 cloudbase env:list 查看环境状态'));
                }
            }), 1000);
        });
    });
}
commander_1.default
    .command('env:create <alias>')
    .description('创建新的云开发环境')
    .action(function (alias) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!alias) {
            throw new error_1.CloudBaseError('环境名称不能为空！');
        }
        const loading = utils_1.loadingFactory();
        loading.start('创建环境中');
        const res = yield env_1.createEnv({
            alias
        });
        loading.succeed('创建环境成功！');
        loading.start('环境初始化中');
        if (res.Status === 'NORMAL') {
            loading.start('环境初始化成功');
            return;
        }
        try {
            yield checkEnvAvailability(res.EnvId);
            loading.succeed('环境初始化成功');
        }
        catch (e) {
            loading.fail(e.message);
        }
    });
});
commander_1.default
    .command('env:rename <name> [envId]')
    .description('重命名云开发环境')
    .action(function (name, envId, options) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!name) {
            throw new error_1.CloudBaseError('环境名称不能为空！');
        }
        const { configFile } = options.parent;
        const assignEnvId = yield utils_1.getEnvId(envId, configFile);
        yield env_1.updateEnvInfo({
            envId: assignEnvId,
            alias: name
        });
        logger_1.successLog('更新环境名成功 ！');
    });
});
