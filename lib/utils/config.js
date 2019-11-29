"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validator_1 = require("./validator");
function findAndFlattenFunConfig(baseConfig, name) {
    validator_1.assertHas(baseConfig, 'functions', '未找到函数配置！');
    const fun = baseConfig.functions.find(item => item.name === name);
    validator_1.assertTrue(fun, `未找到函数 ${name} `);
    const config = fun.config || {};
    delete fun.config;
    return Object.assign(Object.assign({}, config), fun);
}
exports.findAndFlattenFunConfig = findAndFlattenFunConfig;
