import * as archiver from 'archiver'
import * as fs from 'fs'
import * as readline from 'readline'
import * as tencentcloud from 'tencentcloud-sdk-nodejs'
import * as ini from 'ini'
import Logger from './logger'
import { TCBRC } from './constant'
import { refreshTmpToken } from './auth'

const logger = new Logger('Auth')

export async function zipDir(dirPath, outputPath) {
    console.log(dirPath, outputPath)
    return new Promise((resolve, reject) => {
        var output = fs.createWriteStream(outputPath)
        var archive = archiver('zip')

        output.on('close', function() {
            // console.log(archive.pointer() + ' total bytes');
            // console.log('archiver has been finalized and the output file descriptor has closed.');
            resolve({
                zipPath: outputPath,
                size: Math.ceil(archive.pointer() / 1024)
            })
        })

        archive.on('error', function(err) {
            reject(err)
        })

        archive.pipe(output)
        archive.directory(dirPath, '')
        archive.finalize()
    })
}

export function askForInput(question) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })
    return new Promise(resolve => {
        rl.question(question, answer => {
            resolve(answer)
            rl.close()
        })
    })
}

export function callCloudApi(secretId, secretKey) {
    const CvmClient = tencentcloud.cvm.v20170312.Client
    const models = tencentcloud.cvm.v20170312.Models
    const Credential = tencentcloud.common.Credential
    let cred = new Credential(secretId, secretKey)
    let client = new CvmClient(cred, 'ap-shanghai')
    let req = new models.DescribeZonesRequest()

    return new Promise((resolve, reject) => {
        client.DescribeZones(req, function(err, response) {
            if (err) {
                reject(err)
                return
            }
            resolve(response)
        })
    })
}

// 获取身份认证信息并校验、自动刷新
export async function getMetadata() {
    const isTcbrcExit = fs.existsSync(TCBRC)
    // 没有登录信息
    if (!isTcbrcExit) {
        logger.error('您还没有登录，请使用 tcb login 登录')
        return {}
    }

    const tcbrc = ini.parse(fs.readFileSync(TCBRC, 'utf-8'))

    // 存在永久密钥
    if (tcbrc.secretId && tcbrc.secretKey) {
        return tcbrc
    }

    // 存在临时密钥信息
    if (tcbrc.refreshToken) {
        // 临时密钥在 2 小时有效期内，可以直接使用
        if (Date.now() < tcbrc.tmpExpired) {
            const { tmpSecretId, tmpSecretKey, tmpToken } = tcbrc
            return {
                secretId: tmpSecretId,
                secretKey: tmpSecretKey,
                token: tmpToken
            }
        } else if (Date.now() < tcbrc.expired) {
            // 临时密钥超过两小时有效期，但在 1 个月 refresh 有效期内，刷新临时密钥
            const credential = await refreshTmpToken(tcbrc)
            fs.writeFileSync(TCBRC, ini.stringify(credential))
            const { tmpSecretId, tmpSecretKey, tmpToken } = credential
            return {
                secretId: tmpSecretId,
                secretKey: tmpSecretKey,
                token: tmpToken
            }
        }
    }

    // 无有效身份信息，提示登录
    logger.error('无有效身份信息，请使用 tcb login 登录')
    return {}
}
