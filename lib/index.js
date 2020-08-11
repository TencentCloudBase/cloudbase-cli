"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const common_1 = require("./commands/common");
require("./commands");
var commands_1 = require("./commands");
Object.defineProperty(exports, "smartDeploy", { enumerable: true, get: function () { return commands_1.smartDeploy; } });
common_1.registerCommands();
