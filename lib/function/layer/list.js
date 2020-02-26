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
const utils_1 = require("../../utils");
const scfService = new utils_1.CloudApiService('scf');
function listLayers(options) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const { offset, limit } = options;
        const res = yield scfService.request('ListLayers', {
            Offset: offset,
            Limit: limit
        });
        return ((_a = res) === null || _a === void 0 ? void 0 : _a.Layers) || [];
    });
}
exports.listLayers = listLayers;
function listLayerVersions(options) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const { name } = options;
        const res = yield scfService.request('ListLayerVersions', {
            LayerName: name
        });
        return ((_a = res) === null || _a === void 0 ? void 0 : _a.LayerVersions) || [];
    });
}
exports.listLayerVersions = listLayerVersions;
