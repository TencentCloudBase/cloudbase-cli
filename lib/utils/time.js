"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function formatDate(date, fmt) {
    if (date instanceof Date === false) {
        date = new Date(date);
    }
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, String(date.getFullYear()).substr(4 - RegExp.$1.length));
    }
    let expMap = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds(),
        S: date.getMilliseconds()
    };
    for (let exp in expMap) {
        if (new RegExp('(' + exp + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1
                ? expMap[exp]
                : ('00' + expMap[exp]).substr(String(expMap[exp]).length));
        }
    }
    return fmt;
}
exports.formatDate = formatDate;
