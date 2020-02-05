"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
lodash_1.default.mixin({
    deep: function (obj, mapper) {
        return mapper(lodash_1.default.mapValues(obj, function (v) {
            if (lodash_1.default.isPlainObject(v)) {
                return lodash_1.default.deep(v, mapper);
            }
            if (lodash_1.default.isArray(v)) {
                return lodash_1.default.map(v, val => lodash_1.default.deep(val, mapper));
            }
            return v;
        }));
    }
});
function firstLetterToLowerCase(data) {
    return lodash_1.default.deep(data, function (x) {
        return lodash_1.default.mapKeys(x, function (val, key) {
            return key.charAt(0).toLowerCase() + key.slice(1);
        });
    });
}
exports.firstLetterToLowerCase = firstLetterToLowerCase;
