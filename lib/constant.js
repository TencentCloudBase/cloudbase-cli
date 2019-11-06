"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ConfigItems {
}
exports.ConfigItems = ConfigItems;
ConfigItems.credentail = 'credential';
ConfigItems.ssh = 'ssh';
exports.defaultFunctionDeployOptions = {
    config: {
        timeout: 5,
        runtime: 'Nodejs8.9'
    },
    handler: 'index.main'
};
exports.DefaultCloudBaseConfig = {
    functionRoot: './functions',
    functions: []
};
