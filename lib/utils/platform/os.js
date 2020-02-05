"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const os_1 = __importDefault(require("os"));
const macOSMap = new Map([
    [19, 'Catalina'],
    [18, 'Mojave'],
    [17, 'High Sierra'],
    [16, 'Sierra'],
    [15, 'El Capitan'],
    [14, 'Yosemite'],
    [13, 'Mavericks'],
    [12, 'Mountain Lion'],
    [11, 'Lion'],
    [10, 'Snow Leopard'],
    [9, 'Leopard'],
    [8, 'Tiger'],
    [7, 'Panther'],
    [6, 'Jaguar'],
    [5, 'Puma']
]);
const winMap = new Map([
    ['10.0', '10'],
    ['6.3', '8.1'],
    ['6.2', '8'],
    ['6.1', '7'],
    ['6.0', 'Vista'],
    ['5.2', 'Server 2003'],
    ['5.1', 'XP'],
    ['5.0', '2000'],
    ['4.9', 'ME'],
    ['4.1', '98'],
    ['4.0', '95']
]);
function getPlatformRelease(platform, release) {
    if (platform === 'darwin') {
        const releaseNum = Number(release.split('.')[0]);
        const name = macOSMap.get(releaseNum);
        const version = '10.' + (releaseNum - 4);
        return `${name} ${version}`;
    }
    if (platform === 'win32') {
        const version = (/\d+\.\d/.exec(release) || [])[0];
        return `Windows ${winMap.get(version)}`;
    }
    return 'Linux';
}
exports.getPlatformRelease = getPlatformRelease;
function getOSInfo() {
    const hostname = os_1.default.hostname();
    const platform = os_1.default.platform();
    const release = os_1.default.release();
    const platformRelease = getPlatformRelease(platform, release);
    return [hostname, platformRelease].join('/');
}
exports.getOSInfo = getOSInfo;
