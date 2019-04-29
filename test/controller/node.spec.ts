import NodeController from '../../src/controller/node'
import { iNodeDeployConfig } from '../utils'

describe('class NodeController', () => {
    let controller: NodeController | null = null

    beforeAll(async () => {
        controller = new NodeController(iNodeDeployConfig)
    })

    afterAll(async () => {
        controller = null
    })

    test('#start', async () => {
        expect.assertions(1)

        try {
            const result = await controller.start({ vemo: true })
            expect(result).toBeUndefined()
        } catch (error) {
            console.error(error)
            expect(typeof error).toBe('object')
        }
    })

    test('#logs', async () => {
        expect.assertions(1)

        try {
            const result = await controller.logs({ lines: 20 })
            expect(result).toBeUndefined()
        } catch (error) {
            console.error(error)
            expect(typeof error).toBe('object')
        }
    })

    test('#show', async () => {
        expect.assertions(1)

        try {
            const result = await controller.show()
            expect(result).toBeUndefined()
        } catch (error) {
            console.error(error)
            expect(typeof error).toBe('object')
        }
    })

    test('#delete', async () => {
        expect.assertions(1)

        try {
            const result = await controller.delete()
            expect(result).toBeUndefined()
        } catch (error) {
            console.error(error)
            expect(typeof error).toBe('object')
        }
    })

})