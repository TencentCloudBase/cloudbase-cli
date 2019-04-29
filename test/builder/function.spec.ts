import * as fs from 'fs'
import * as path from 'path'
import FunctionBuilder from './../../src/builder/function'
import { iFunctionDeployConfig as config} from './../utils'

describe('class FunctionBuilder', () => {
    let builder: FunctionBuilder | null = null

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