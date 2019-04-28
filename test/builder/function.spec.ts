import * as fs from 'fs'
import * as path from 'path'
import FunctionBuilder from './../../src/builder/function'
import { IFunctionDeployConfig } from './../../src/deploy/function'
import { randomStr } from './../../src/utils'

describe('class FunctionBuilder', () => {
    let builder: FunctionBuilder | null = null
    const config: IFunctionDeployConfig = {
        secretId: 'secretId',
        secretKey: 'secretKey',
        name: 'test',
        path: './test',
        envId: 'envId',
        distPath: `${randomStr()}jest-dist`,
        override: true
    }

    beforeAll(() => new Promise(resolve => {
        builder = new FunctionBuilder(config)
        resolve()
    }))

    test('#build', async () => {
        expect.assertions(2)

        const { success, assets } = await builder.build()
        expect(success).toBeTruthy()
        expect(Array.isArray(assets)).toBeTruthy()
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