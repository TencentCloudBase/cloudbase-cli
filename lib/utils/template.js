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
exports.initProjectConfig = exports.extractTemplate = exports.downloadTemplate = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const enquirer_1 = require("enquirer");
const toolbox_1 = require("@cloudbase/toolbox");
const error_1 = require("../error");
const net_1 = require("./net");
const log_1 = require("./log");
const fs_2 = require("./fs");
const output_1 = require("./output");
const reporter_1 = require("./reporter");
const listUrl = 'https://tcli.service.tcloudbase.com/templates';
const getTemplateAddress = (templatePath) => `https://7463-tcli-1258016615.tcb.qcloud.la/cloudbase-templates/${templatePath}.zip`;
function downloadTemplate(options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        let { templateUri, appName, newProject, projectPath = process.cwd() } = options;
        const templates = yield output_1.execWithLoading(() => net_1.fetch(listUrl), {
            startTip: '获取应用模板列表中'
        });
        let templateName;
        let tempateId;
        if (templateUri) {
            tempateId = templateUri;
        }
        else {
            const { selectTemplateName } = yield enquirer_1.prompt({
                type: 'select',
                name: 'selectTemplateName',
                message: '请选择应用模板',
                choices: templates.map((item) => item.name)
            });
            templateName = selectTemplateName;
        }
        const selectedTemplate = templateName
            ? templates.find((item) => item.name === templateName)
            : templates.find((item) => item.path === tempateId);
        if (!selectedTemplate) {
            log_1.logger.info(`模板 \`${templateName || tempateId}\` 不存在`);
            return;
        }
        if (newProject) {
            if (!appName) {
                const { projectName } = yield enquirer_1.prompt({
                    type: 'input',
                    name: 'projectName',
                    message: '请输入项目名称',
                    initial: selectedTemplate.path
                });
                appName = projectName;
            }
            projectPath = path_1.default.join(process.cwd(), appName);
            if (fs_2.checkFullAccess(projectPath)) {
                const { cover } = yield enquirer_1.prompt({
                    type: 'confirm',
                    name: 'cover',
                    message: `已存在同名文件夹：${appName}，是否覆盖？`,
                    initial: false
                });
                if (!cover) {
                    throw new error_1.CloudBaseError('操作终止！');
                }
                else {
                    fs_extra_1.default.removeSync(projectPath);
                }
            }
        }
        yield output_1.execWithLoading(() => __awaiter(this, void 0, void 0, function* () {
            yield reporter_1.templateDownloadReport(selectedTemplate.path, selectedTemplate.name);
            yield extractTemplate(projectPath, selectedTemplate.path, selectedTemplate.url);
        }), {
            startTip: '下载文件中'
        });
        return projectPath;
    });
}
exports.downloadTemplate = downloadTemplate;
function extractTemplate(projectPath, templatePath, remoteUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = remoteUrl || getTemplateAddress(templatePath);
        return net_1.fetchStream(url).then((res) => __awaiter(this, void 0, void 0, function* () {
            if (!res) {
                throw new error_1.CloudBaseError('请求异常');
            }
            if (res.status !== 200) {
                throw new error_1.CloudBaseError('未找到文件');
            }
            yield toolbox_1.unzipStream(res.body, projectPath);
        }));
    });
}
exports.extractTemplate = extractTemplate;
function initProjectConfig(envId, region, projectPath = process.cwd()) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        let filepath = (_a = (yield toolbox_1.searchConfig(projectPath))) === null || _a === void 0 ? void 0 : _a.filepath;
        if (!filepath) {
            fs_1.default.writeFileSync(path_1.default.join(projectPath, 'cloudbaserc.json'), JSON.stringify({
                envId,
                region,
                version: '2.0',
                $schema: 'https://framework-1258016615.tcloudbaseapp.com/schema/latest.json'
            }));
        }
        else {
            const configContent = fs_1.default.readFileSync(filepath).toString();
            fs_1.default.writeFileSync(filepath, configContent.replace('{{envId}}', envId));
            const configPath = filepath || path_1.default.join(projectPath, 'cloudbaserc.json');
            const parser = new toolbox_1.ConfigParser({
                configPath
            });
            parser.update('region', region);
        }
    });
}
exports.initProjectConfig = initProjectConfig;
