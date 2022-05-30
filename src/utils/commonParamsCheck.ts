import { CloudBaseError } from '../error'
import { convertNumber } from '../run'
import { ITcbrServiceOptionalOptions, ITcbrServiceConvertedOptionalOptions } from '../types'
import { validateCpuMem } from './validator'

export function parseOptionalParams(options: ITcbrServiceOptionalOptions): ITcbrServiceConvertedOptionalOptions {
    let cpuConverted
    let memConverted
    if (options.cpu || options.mem) {
        let data = validateCpuMem(options.cpu, options.mem)
        ;[cpuConverted, memConverted] = [data.cpuOutput, data.memOutput]
    }

    let maxNumConverted
    if (options.maxNum) {
        maxNumConverted = convertNumber(options.maxNum)
        if (maxNumConverted < 0 || maxNumConverted > 50) {
            throw new CloudBaseError('最大副本数必须大于等于0且小于等于50')
        }
    }

    let minNumConverted
    if (options.minNum) {
        minNumConverted = convertNumber(options.minNum)
        if (minNumConverted < 0 || minNumConverted > 50) {
            throw new CloudBaseError('最小副本数必须大于等于0且小于等于50')
        }
    }

    if (minNumConverted > maxNumConverted) {
        throw new CloudBaseError('最小副本数不能大于最大副本数')
    }

    return {
        cpuConverted,
        memConverted,
        maxNumConverted,
        minNumConverted
    }
}

/**
 * 
 * @description 通用两层三元运算符的参数处理，例如
 *              MaxNum: maxNumConverted
                ? convertNumber(maxNum)
                : _override
                    ? (previousServerConfig?.MaxNum)
                    : 50
 * @param originalParam 原始参数，如 maxNumConverted
 * @param override 是否覆盖，如 _override
 * @param handler 处理参数的函数，如 convertNumber
 * @param overrideVal 如果覆盖，提供的默认覆盖值
 * @param defaultVal 默认值
 * @param args 传入 handler 中使用的额外参数
 */
export function parseInputParam(originalParam, override: boolean, handler: Function | null, overrideVal, defaultVal, ...args) {
    return originalParam
        ? (typeof handler === 'function')
            ? handler(originalParam, ...args)
            : originalParam
        : override
            ? overrideVal
            : defaultVal
}