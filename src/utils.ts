import * as archiver from 'archiver'
import * as fs from 'fs'
import * as readline from 'readline'
import * as tencentcloud from 'tencentcloud-sdk-nodejs'
import * as ini from 'ini'
import * as path from 'path'
import * as os from 'os'
import * as node_ssh from 'node-ssh'

export async function zipDir(dirPath, outputPath) {
    console.log(dirPath, outputPath)
    return new Promise((resolve, reject) => {
        var output = fs.createWriteStream(outputPath);
        var archive = archiver('zip');

        output.on('close', function () {
            // console.log(archive.pointer() + ' total bytes');
            // console.log('archiver has been finalized and the output file descriptor has closed.');
            resolve({
                zipPath: outputPath,
                size: Math.ceil(archive.pointer() / 1024)
            })
        });

        archive.on('error', function (err) {
            reject(err)
        });

        archive.pipe(output);
        archive.directory(dirPath, '');
        archive.finalize();
    })
}


const TCBRC = path.resolve(os.homedir(), '.tcbrc.json')
export async function login() {
    const secretId = await askForInput('请输入腾讯云SecretID：')
    const secretKey = await askForInput('请输入腾讯云SecretKey：')
    try {
        await callCloudApi(secretId, secretKey)
    } catch (e) {
        if (e.code.indexOf('AuthFailure') !== -1) {
            throw new Error('登录失败，请检查密钥是否正确')
        }
        throw new Error(`登录失败：${e.code}`)
    }

    const sshInfo = {
        host: await askForInput('请输入主机IP：'),
        password: await askForInput('请输入主机密码：'),
        username: await askForInput('请输入用户名：(root)') || 'root',
        port: await askForInput('请输入ssh端口号：(22)') || 22
    }
    const ssh = new node_ssh()
    await ssh.connect(sshInfo)
    await ssh.dispose()


    fs.writeFileSync(TCBRC, ini.stringify({ secretId, secretKey, ...sshInfo }))
    return { secretId, secretKey, ...sshInfo }
}

export async function logout() {
    await fs.unlinkSync(TCBRC)
}

export async function getMetadata() {
    if (fs.existsSync(TCBRC)) {
        const tcbrc = ini.parse(fs.readFileSync(TCBRC, 'utf-8'))
        if (!tcbrc.secretId || !tcbrc.secretKey || !tcbrc.host || !tcbrc.password || !tcbrc.username || !tcbrc.port) {
            // 缺少信息，重新登录
            return await login()
        }
        return tcbrc
    } else {
        // 没有登录过
        return await login()
    }
}

export function askForInput(question) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer)
            rl.close();
        });
    })
}

export function callCloudApi(secretId, secretKey) {
    const CvmClient = tencentcloud.cvm.v20170312.Client;
    const models = tencentcloud.cvm.v20170312.Models;
    const Credential = tencentcloud.common.Credential;
    let cred = new Credential(secretId, secretKey);
    let client = new CvmClient(cred, "ap-shanghai");
    let req = new models.DescribeZonesRequest();

    return new Promise((resolve, reject) => {
        client.DescribeZones(req, function (err, response) {
            if (err) {
                reject(err)
                return;
            }
            resolve(response)
        });
    })
}

const characters: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
export function randomStr(bits: number = 32): string {
    if (bits <= 0) {
        return ''
    }

    const length: number = characters.length
    let str: string = ''
    for(let i = 0; i < bits; ++i) {
        let pos: number = Math.round(Math.random() * (length - 1))
        str += characters[pos]
    }

    return str
}