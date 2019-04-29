import {
    iFunctionDeployConfig,
    iNodeDeployConfig
} from './../utils'
import NodeUploader from './../../src/uploader/function'
import FunctionBuilder from './../../src/builder/function'

describe('class NodeUploader', () => {
    let uploader: NodeUploader | null = null
    let builder: FunctionBuilder | null = null
    
    beforeAll(async () => {
        uploader = new NodeUploader(iFunctionDeployConfig)
        builder = new FunctionBuilder(iFunctionDeployConfig)
        await builder.build()
    })

    afterAll(async () => {
        await builder.clean()
        uploader = null
        builder = null
    })

    test('#requestCloudApi', async () => {
        expect.hasAssertions()

        const params = {
            FunctionName: 'hello_world'
        }

        try {
            const res = await uploader.requestCloudApi('Invoke', params)
            expect(res).not.toBeNull()
        } catch (error) {
            expect(error instanceof Object).toBeTruthy()
        }
    })

    test('#upload', async () => {
        expect.hasAssertions()

        try {
            const res = await uploader.upload()
            expect(res).not.toBeNull()
        } catch (error) {
            console.log(error.message)
            expect(error instanceof Error).toBeTruthy()
        }
    })
})