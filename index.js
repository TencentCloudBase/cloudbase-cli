const ncc = require('@zeit/ncc')
const node_ssh = require('node-ssh')
const fs = require('fs')
const path = require('path')
const makeDir = require('make-dir')
const del = require('del')

// 输入量
const HOST = '10.85.27.207'
const USERNAME = 'root'
const PORT = 36000
const PWD = 'tpcloud@123'
const DIST_PATH = './dist'
const REMOTE_PATH = '/root/dist'


async function build(appEntry) {
    if (fs.existsSync(path.resolve(__dirname, DIST_PATH))) {
        del.sync([DIST_PATH])
    }
    await makeDir(DIST_PATH)
    const { code, map, assets } = await ncc(appEntry)
    fs.writeFileSync(`${DIST_PATH}/${path.basename(appEntry)}`, code)
    for (let asset in assets) {
        fs.writeFileSync(`${DIST_PATH}/${asset}`, assets[asset].source)
    }
}

async function uploadFile() {
    const ssh = new node_ssh()

    await ssh.connect({
        host: HOST,
        username: USERNAME,
        port: PORT,
        password: PWD,
    })

    await ssh.execCommand(`rm -rf ${REMOTE_PATH}`)
    await ssh.putDirectory(path.resolve(__dirname, DIST_PATH), REMOTE_PATH)

    var { stdout, stderr } = await ssh.execCommand(`pm2 reload ${REMOTE_PATH}/app.js`)
    console.log(stdout)

    ssh.dispose()
}

exports.update = async function(appEntry) {
    appEntry = path.resolve(__dirname, appEntry)
    await build(appEntry)
    await uploadFile()
}
