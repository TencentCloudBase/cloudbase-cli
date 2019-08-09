import {
    listEnvs
} from '../../src/env'

test('列出所有环境：tcb list', async () => {
    const data = await listEnvs()

    expect(data.length).toBeGreaterThanOrEqual(1)
})