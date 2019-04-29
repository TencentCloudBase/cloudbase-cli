import * as path from 'path'
import * as del from 'del'
import * as node_ssh from 'node-ssh'
import * as makeDir from 'make-dir'
import NodeUploader from './../../src/uploader/node'
import { zipDir } from './../../src/utils'
import { iNodeUploaderOptions as config } from './../config'

describe('class NodeUploader', () => {
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
        expect.hasAssertions()

        try {
            const { 
                host, 
                username, 
                port, 
                password,
                remotePath
            } = config
            const uploader = new NodeUploader(config)
            const ssh = new node_ssh()

            await uploader.upload()
            await ssh.connect({
                host,
                username,
                port,
                password
            })
            const { stdout }  = await ssh.execCommand(`ls ${remotePath}`)
            expect(stdout.length).toBeGreaterThan(0)
            await ssh.dispose()
        } catch (error) {
            expect(typeof error).toBe('object')
        }
    })

})