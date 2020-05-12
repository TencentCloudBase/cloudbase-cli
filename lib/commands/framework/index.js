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
const command_1 = require("../command");
const framework_core_1 = require("@cloudbase/framework-core");
const utils_1 = require("../../utils");
const commands = [
    {
        cmd: 'framework:deploy [module]',
        options: [
            {
                flags: '-e, --envId <envId>',
                desc: '环境 Id'
            },
            { flags: '--debug', desc: '是否打印详细日志' }
        ],
        desc: '云开发 Serverless 应用框架：部署全栈应用',
        handler: (ctx, module) => __awaiter(void 0, void 0, void 0, function* () {
            yield callFramework(ctx, 'deploy', module);
        })
    }
];
function callFramework(ctx, command, module) {
    return __awaiter(this, void 0, void 0, function* () {
        const { envId, config } = ctx;
        const { secretId, secretKey } = yield utils_1.authStore.get('credential');
        yield framework_core_1.run({
            projectPath: process.cwd(),
            cloudbaseConfig: {
                secretId,
                secretKey,
                envId
            },
            config: config.framework,
            logLevel: ctx.options.debug ? 'debug' : 'info'
        }, command, module);
    });
}
commands.forEach((item) => {
    const command = new command_1.Command(item);
    command.init();
});
