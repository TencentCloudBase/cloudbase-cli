import * as fs from 'fs'
import * as path from 'path'
import NodeZipBuilder from './../../src/builder/node-zip'
import { iNodeDeployConfig as config} from './../config'

describe('class NodeZipBuilder', () => {
    let builder: NodeZipBuilder | null = null

    beforeAll(() => new Promise(resolve => {
        builder = new NodeZipBuilder(config)
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
        const zipPath = path.resolve(process.cwd(), config.distPath, 'dist.zip')
        expect(fs.existsSync(zipPath)).toBeFalsy()
    })

    afterAll(() => new Promise(resolve => {
        builder = null
        resolve()
    }))
})