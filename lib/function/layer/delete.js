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
function deleteLayer(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, version } = options;
        return scfService.request('DeleteLayerVersion', {
            LayerName: name,
            LayerVersion: version
        });
    });
}
exports.deleteLayer = deleteLayer;
