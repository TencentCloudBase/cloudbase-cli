import * as fs from 'fs'
import * as path from 'path'
import NodeZipBuilder from './../../src/builder/node-zip'
import { INodeDeployConfig } from './../../src/deploy/node'
import { randomStr } from './../../src/utils'

describe('class NodeZipBuilder', () => {
    let builder: NodeZipBuilder | null = null
    const options: INodeDeployConfig = {
        host: 'host',
        username: 'username',
        port: 3000,
        password: 'password',
        secretId: 'secretId',
        secretKey: 'secretKey',
        name: 'name',
        path: 'test',
        distPath: `${randomStr()}jest-dist`,
        remotePath: 'string'
    }

    beforeAll(() => new Promise(resolve => {
        builder = new NodeZipBuilder(options)
        resolve()
    }))

    test('#build', async () => {
        expect.assertions(3)

        const { success, assets, vemo } = await builder.build()
        expect(success).toBeTruthy()
        expect(Array.isArray(assets)).toBeTruthy()
        expect(typeof vemo).toBe('boolean')
    })

    test('#clean', async () => {
        expect.assertions(1)

        await builder.clean()
        const zipPath = path.resolve(process.cwd(), options.distPath, 'dist.zip')
        expect(fs.existsSync(zipPath)).toBeFalsy()
    })

    afterAll(() => new Promise(resolve => {
        builder = null
        resolve()
    }))
})