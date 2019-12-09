import { CloudBaseError } from '../error'

export function assertTrue(val: any, errMsg) {
    if (!val) {
        throw new CloudBaseError(errMsg)
    }
}

export function assertHas(obj: any, prop: string, errMsg): void {
    if (!obj[prop]) {
        throw new CloudBaseError(errMsg)
    }
}
