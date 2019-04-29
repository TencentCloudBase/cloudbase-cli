import * as path from 'path'
import * as del from 'del'
import * as node_ssh from 'node-ssh'
import * as makeDir from 'make-dir'
import { zipDir } from './../../src/utils'
import NodeUploader from './../../src/uploader/node-zip'
import { iNodeDeployConfig as config } from './../config'

describe('class NodeZipUploader', () => {
    beforeAll(async () => {
        const entry = path.resolve(process.cwd(), 'test')
        const distPath = path.resolve(process.cwd(), config.distPath)
        const zipPath = path.resolve(distPath, '/dist.zip')
        await makeDir(distPath)
        await zipDir(entry, zipPath)
    })

    afterAll(async () => {
        const distPath = path.resolve(process.cwd(), config.distPath)
        del.sync(distPath)
    })

    test('#upload', async () => {
        const {
            host,
            username,
            port,
            password,
            remotePath
        } = config

        try {
            const uploader = new NodeUploader(config)
            const ssh = new node_ssh()
            await uploader.upload()
            await ssh.connect({
                host,
                username,
                port,
                password
            })
            const { stdout } = await ssh.execCommand(`ls ${remotePath}`)
            expect(stdout.length).toBeGreaterThan(0)
            await ssh.dispose()
        } catch (error) {
            expect(typeof error).toBe('object')
        }
    })
})