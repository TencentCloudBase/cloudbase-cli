export function formatDate(dateParam: string | number | Date, fmtParam: string) {
    let date: Date
    let fmt = fmtParam
    if (date instanceof Date === false) {
        date = new Date(dateParam)
    }
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, String(date.getFullYear()).substr(4 - RegExp.$1.length))
    }

    let expMap = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds(),
        S: date.getMilliseconds()
    }
    for (let exp in expMap) {
        if (new RegExp('(' + exp + ')').test(fmt)) {
            fmt = fmt.replace(
                RegExp.$1,
                RegExp.$1.length === 1
                    ? expMap[exp]
                    : ('00' + expMap[exp]).substr(String(expMap[exp]).length)
            )
        }
    }
    return fmt
}

export async function sleep(time: number) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve()
        }, time)
    })
}
