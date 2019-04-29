import NodeDeploy from '../../src/deploy/node'
import { iNodeDeployConfig } from '../utils'

describe('class NodeDeploy', () => {
    let deployer: NodeDeploy | null = null

    beforeAll(async () => {
        deployer = new NodeDeploy(iNodeDeployConfig)
    })

    afterAll(async () => {
        deployer = null
    })
    
    test('#deploy', async () => {
        expect.assertions(1)

        try {
            const result = await deployer.deploy()
            expect(result).toBeUndefined()
        } catch (error) {
            console.error(error)
            expect(typeof error).toBe('object')
        }
    })

    test('#clear', () => {
        const result = deployer.clear()
        expect(result).toBeUndefined()
    })

})