import { CloudBaseError } from '../error'
import { CPU_MEM_OPTS } from '../constant'
import { convertNumber } from '../run'

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


export const validateIp = (ip: string): boolean => {
    if (Object.prototype.toString.call(ip) !== '[object String]') return false
    const fields = ip.split('.')
    if (
        fields.length !== 4 ||
        fields.find(item => isNaN(Number(item)) || Number(item) < 0 || Number(item) > 255)
    ) return false
    return true
}

// 检查 cpu 和 mem 是否符合约束条件
export const validateCpuMem = (cpuInput: number | string | undefined, memInput: number | string | undefined): { cpuOutput: number, memOutput: number } => {
    if (cpuInput !== undefined && memInput !== undefined) {
        let cpuSet = convertNumber(cpuInput)
        let memSet = convertNumber(memInput)
        let validMemSet = CPU_MEM_OPTS.find(({ cpu }) => cpu === cpuSet)
        if (!validMemSet || !validMemSet.mems.length || !validMemSet.mems.includes(memSet)) {
            throw new CloudBaseError(`cpu 与 mem 规格不匹配，当前规格：cpu: ${cpuInput}, mem: ${memInput}
请使用下列规格组合之一：${CPU_MEM_OPTS.map(({ cpu, mems }) => `${cpu}-${mems.join('/')}`).join('，')}`)
        }
        return { cpuOutput: cpuSet, memOutput: memSet }
    }
    if (cpuInput) {
        let cpuSet = convertNumber(cpuInput)
        let validSet = CPU_MEM_OPTS.find(({ cpu }) => cpu === cpuSet)
        if (!validSet) {
            throw new CloudBaseError(`不支持当前 cpu 规格，请使用下列 cpu 规格之一：${CPU_MEM_OPTS.map(({ cpu }) => cpu).join('，')}`)
        }
        return { cpuOutput: cpuSet, memOutput: CPU_MEM_OPTS.find(({ cpu }) => cpu === cpuSet).mems[0] }
    }
    if (memInput) {
        let memSet = convertNumber(memInput)
        let validSet = CPU_MEM_OPTS.find(({ mems }) => mems.includes(memSet))
        if (!validSet) {
            throw new CloudBaseError(`不支持当前 mem 规格，请使用下列 mem 规格之一：${CPU_MEM_OPTS.map(({ mems }) => mems.join('/')).join('，')}`)
        }
        return { cpuOutput: validSet.cpu, memOutput: memSet }
    }
}