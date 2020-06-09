import { createParamDecorator } from './common'
import { Logger } from './_log'
import { ParamTypes } from '../constants'
import { authSupevisor, getArgs } from '../../utils'

const EmptyValue = () => {}

// 注入登录态信息
export const Credential = createParamDecorator(ParamTypes.Credential, async () => {
    const credential = await authSupevisor.getLoginState()
    return credential
})

// 日志打印
export const Log = createParamDecorator(ParamTypes.Log, () => {
    const args = getArgs()
    const verbose = process.VERBOSE || args['--verbose']
    const log = new Logger({
        verbose
    })

    return log
})

// 命令行相关
export const CmdContext = createParamDecorator(ParamTypes.CmdContext, EmptyValue)

export const ArgsOptions = createParamDecorator(ParamTypes.ArgsOptions, EmptyValue)

export const ArgsParams = createParamDecorator(ParamTypes.ArgsParams, EmptyValue)

// 获取环境 Id
export const EnvId = createParamDecorator(ParamTypes.EnvId, EmptyValue)

// 注入环境配置
export const Config = createParamDecorator(ParamTypes.Config, EmptyValue)
