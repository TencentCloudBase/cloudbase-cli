import  tencentcloud from '../../deps/tencentcloud-sdk-nodejs'
import ora from 'ora'
import Logger from '../logger'
import { getAuthTokenFromWeb, refreshTmpToken } from './auth'
import { askForInput, getCredential } from '../utils'
import { ConfigItems } from '../constant'
import { configStore } from '../utils/configstore'
import { Credential } from '../types'
import { TcbError } from '../error'

const logger = new Logger('Login')

// 调用 SCF 接口，检查密钥是否有效
async function checkAuth(credential: Credential) {
    const { tmpSecretId, tmpSecretKey, tmpToken } = credential
    const ScfClient = tencentcloud.scf.v20180416.Client
    const models = tencentcloud.scf.v20180416.Models
    const Credential = tencentcloud.common.Credential
    let cred = new Credential(tmpSecretId, tmpSecretKey, tmpToken)
    let client = new ScfClient(cred, 'ap-shanghai')
    let req = new models.ListFunctionsRequest()

    return new Promise((resolve, reject) => {
        client.ListFunctions(req, (err, response) => {
            if (err) {
                reject(err)
                return
            }
            resolve(response)
        })
    })
}

function getAuthData(): Credential {
    const tcbrc = configStore.get(ConfigItems.credentail)
    return tcbrc as Credential
}

// 打开腾讯云 TCB 控制台，通过获取临时密钥登录，临时密钥可续期，最长时间为 1 个月
export async function authLogin() {
    const tcbrc: Credential = getAuthData()
    // 已有永久密钥
    if (tcbrc.secretId && tcbrc.secretKey) {
        logger.log('您已登录，无需再次登录！')
        return
    }
    // 如果存在临时密钥，校验临时密钥是否有效，是否需要续期
    const tmpExpired = Number(tcbrc.tmpExpired) || 0
    let refreshExpired = Number(tcbrc.expired) || 0
    const now = Date.now()

    if (now < tmpExpired) {
        logger.log('您已经登录，无需再次登录！')
        return
    }

    let credential
    const authSpinner = ora('获取授权中')

    try {
        if (now < refreshExpired) {
            // 临时 token 过期，自动续期
            authSpinner.start()
            credential = await refreshTmpToken(tcbrc)
        } else {
            authSpinner.start()
            // 通过腾讯云-云开发控制台获取授权
            credential = await getAuthTokenFromWeb()
        }
        authSpinner.succeed('获取授权成功')
    } catch (error) {
        authSpinner.fail(`获取授权失败 ${error}`)
        throw new TcbError(error)
    }

    if (!credential.refreshToken || !credential.uin) {
        logger.error('授权信息无效')
        return
    }

    const scfCheckSpinner = ora('验证密匙权限').start()

    try {
        await checkAuth(credential)
        scfCheckSpinner.succeed('密钥权限验证成功')
    } catch (e) {
        throw new TcbError(e.message)
    }

    configStore.set(ConfigItems.credentail, credential)

    logger.success('登录成功！')
}

// 使用永久密钥登录
export async function login() {
    const tcbrc: Credential = await getCredential()
    // 已有永久密钥
    if (tcbrc.secretId && tcbrc.secretKey) {
        logger.log('您已通过 secretKey 登录，无需再次登录！')
        return
    }

    // 存在临时密钥，通过临时密钥登录
    if (tcbrc.refreshToken && tcbrc.uin) {
        logger.log('检查到您已获取腾讯云授权，正在尝试通过授权登录')
        authLogin()
        return
    }
    const secretId: string = (await askForInput(
        '请输入腾讯云 SecretID：'
    )) as string
    const secretKey: string = (await askForInput(
        '请输入腾讯云 SecretKey：'
    )) as string

    if (!secretId || !secretKey) {
        logger.error('SecretID 或 SecretKey 不能为空')
        return
    }

    const cloudSpinner = ora('正在验证腾讯云密钥...').start()
    try {
        await checkAuth({
            tmpSecretId: secretId,
            tmpSecretKey: secretKey
        })
        cloudSpinner.succeed('腾讯云密钥验证成功')
    } catch (e) {
        cloudSpinner.fail(
            '腾讯云密钥验证失败，请检查密钥是否正确或本机网络代理有问题'
        )
        return
    }

    configStore.set(ConfigItems.credentail, { secretId, secretKey })

    logger.success('登录成功！')
}
