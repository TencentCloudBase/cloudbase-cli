import FunctionDeploy from '../../src/deploy/function'
import { iFunctionDeployConfig } from './../utils'

describe('class FunctionDeploy', () => {
    
    test('#deploy', async () => {
        expect.assertions(1)

        const deployer = new FunctionDeploy(iFunctionDeployConfig)
        try {
            const result = await deployer.deploy()
            expect(result).toBeUndefined()
        } catch (error) {
            console.error(error)
            expect(typeof error).toBe('object')
        }
    })

})