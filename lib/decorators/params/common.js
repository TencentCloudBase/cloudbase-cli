"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createParamDecorator = void 0;
const constants_1 = require("../constants");
const createParamDecorator = (paramtype, getter) => {
    return () => {
        return (target, key, index) => {
            const data = Reflect.getMetadata(constants_1.PARAM_METADATA, target[key]) || {};
            Reflect.defineMetadata(constants_1.PARAM_METADATA, Object.assign(Object.assign({}, data), { [paramtype]: {
                    index,
                    getter
                } }), target[key]);
        };
    };
};
exports.createParamDecorator = createParamDecorator;
