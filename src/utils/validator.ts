import { CloudBaseError } from '../error'

type SimpleValue = number | string | boolean

export function assertTruthy(val: SimpleValue | SimpleValue[], errMsg: string) {
    let ok
    if (Array.isArray(val)) {
        ok = val.every(item => Boolean(val))
    } else {
        ok = Boolean(val)
    }

    if (!ok) {
        throw new CloudBaseError(errMsg)
    }
}

export function assertHas(obj: any, prop: string, errMsg): void {
    if (!obj[prop]) {
        throw new CloudBaseError(errMsg)
    }
}
