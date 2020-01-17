import { FunctionPacker, CodeType, loadingFactory, CloudApiService } from '../utils'
import { CloudBaseError } from '../error'
import { ICreateFunctionOptions } from '../types'

const scfService = new CloudApiService('scf')

// 更新云函数代码
export async function updateFunctionCode(options: ICreateFunctionOptions) {
    const { func, functionRootPath = '', envId, base64Code = '', codeSecret } = options
    let base64
    let packer
    const funcName = func.name

    // 校验 CodeSecret 格式
    if (codeSecret && !/^[A-Za-z0-9+=/]{1,160}$/.test(codeSecret)) {
        throw new CloudBaseError('CodeSecret 格式错误，格式为 1-160 位大小字母，数字+=/')
    }

    // 校验运行时
    const validRuntime = ['Nodejs8.9', 'Php7', 'Java8']
    if (func.runtime && !validRuntime.includes(func.runtime)) {
        throw new CloudBaseError(
            `${funcName} 非法的运行环境：${func.runtime}，当前支持环境：${validRuntime.join(', ')}`
        )
    }

    let installDependency
    // Node 8.9 默认安装依赖
    installDependency = func.runtime === 'Nodejs8.9' ? 'TRUE' : 'FALSE'
    // 是否安装依赖，选项可以覆盖
    if (typeof func.installDependency !== 'undefined') {
        installDependency = func.installDependency ? 'TRUE' : 'FALSE'
    }

    // CLI 从本地读取
    if (!base64Code) {
        packer = new FunctionPacker(functionRootPath, funcName, func.ignore)
        const type: CodeType = func.runtime === 'Java8' ? CodeType.JavaFile : CodeType.File
        base64 = await packer.build(type)

        if (!base64) {
            throw new CloudBaseError('函数不存在！')
        }
    } else {
        base64 = base64Code
    }

    const params: any = {
        FunctionName: funcName,
        Namespace: envId,
        ZipFile: base64,
        CodeSecret: codeSecret,
        Handler: func.handler || 'index.main',
        InstallDependency: installDependency
    }

    try {
        // 更新云函数代码
        await scfService.request('UpdateFunctionCode', params)
    } catch (e) {
        throw new CloudBaseError(`[${funcName}] 函数代码更新失败： ${e.message}`, {
            code: e.code
        })
    }
}
