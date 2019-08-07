import {
    listFunction,
    createFunction,
    getFunctionDetail,
    getFunctionLog,
    updateFunctionConfig,
    createFunctionTriggers,
    deleteFunctionTrigger,
    deleteFunction,
    invokeFunction
} from '../../src/function'

const envId = 'dev-97eb6c'

test('列出所有函数: function:list', async () => {
    const data = await listFunction({
        envId
    })

    expect(data.length).toBeGreaterThanOrEqual(1)
})

test('列出所有函数: function:list --offset', async () => {
    const data = await listFunction({
        envId,
        offset: 1
    })

    expect(data.length).toBeGreaterThanOrEqual(0)
})

test('列出所有函数: function:list --limit', async () => {
    const data = await listFunction({
        envId,
        limit: 1
    })

    expect(data.length).toBe(1)
})

test('deploy function', async () => {
    const res = await createFunction({
        envId,
        func: {
            // functions 文件夹下函数文件夹的名称，即函数名
            name: 'app',
            // 函数配置
            config: {
                // 超时时间
                timeout: 5,
                // 环境变量
                envVariables: {
                    key: 'value',
                    akey: 'c'
                }
            },
            // 函数触发器，说明见文档: https://cloud.tencent.com/document/product/876/32314
            triggers: [
                {
                    // name: 触发器的名字
                    name: 'myTrigger',
                    // type: 触发器类型，目前仅支持 timer （即定时触发器）
                    type: 'timer',
                    // config: 触发器配置，在定时触发器下，config 格式为 cron 表达式
                    config: '0 0 2 1 * * *'
                }
            ]
        },
        root: '',
        force: true,
        zipFile:
            'UEsDBAoAAAAAAOdCBU8AAAAAAAAAAAAAAAAFAAAAZGlzdC9QSwMEFAAIAAgAkhkBTwAAAAAAAAAAAAAAAAgAAABpbmRleC5qc2WNMQrDMBRDd59Cmx0IuUEy9wadXfdTQlT/Yv+UQMndmxZv0ST0kOTXKqhW5mTeOdleWqwOzzhnjAjylmw9kmaT7WcieYtp6TBO+DgcOlhVykB9BH8RUnHVwrvvTvi/do7begPtIeSV7NEqu/sCUEsHCLKdLCxuAAAAqAAAAFBLAwQUAAgACADnQgVPAAAAAAAAAAAAAAAADQAAAGRpc3QvZGlzdC56aXAL8GZm4WIAgedOrP5gBpRgBdIpmcUl+gFAJSIMHEA4SZIRRQkHUElmXkpqhV5WcWqvIddhAxHn8vlOs2U5djoafWebG/s92Cnkf9L/KQ4n784Wy7+o8mXCk+taK8KepdyzvBkXtYbvvEV6D8enaTm2k9Imv01XquzOfGng98NCxioi9JRDLUu9YFDh1UO73/v92F/Wd7uK+a3ik6lvLmrt/s0U4M3OsWmujk4e0AUrgBjhRnRv8MK8AfKLXlVmAQBQSwcITXynOsAAAADyAAAAUEsBAi0DCgAAAAAA50IFTwAAAAAAAAAAAAAAAAUAAAAAAAAAAAAQAO1BAAAAAGRpc3QvUEsBAi0DFAAIAAgAkhkBT7KdLCxuAAAAqAAAAAgAAAAAAAAAAAAgAKSBIwAAAGluZGV4LmpzUEsBAi0DFAAIAAgA50IFT018pzrAAAAA8gAAAA0AAAAAAAAAAAAgAKSBxwAAAGRpc3QvZGlzdC56aXBQSwUGAAAAAAMAAwCkAAAAwgEAAAAA'
    })

    expect(res).toBe(undefined)
})

test('获取函数详情: function:detail', async () => {
    const detail = await getFunctionDetail({
        envId,
        functionName: 'app'
    })

    expect(detail.FunctionName).toEqual('app')
    expect(detail.MemorySize).toEqual(256)
})

test('获取函数日志: function:log', async () => {
    const logs = await getFunctionLog({
        envId,
        functionName: 'app'
    })

    expect(logs.length).toBeGreaterThanOrEqual(0)
})

test('获取函数日志: function:log', async () => {
    const logs = await getFunctionLog({
        envId,
        functionName: 'app'
    })

    expect(logs.length).toEqual(0)
})

test('更新函数配置: function:config:update', async () => {
    await updateFunctionConfig({
        envId,
        functionName: 'app',
        config: {
            timeout: 6
        }
    })

    const detail = await getFunctionDetail({
        envId,
        functionName: 'app'
    })

    expect(detail.Timeout).toEqual(6)
})

test('创建触发器: function:trigger:create', async () => {
    const res = await createFunctionTriggers({
        envId,
        functionName: 'app',
        triggers: [
            {
                // name: 触发器的名字
                name: 'newTrigger',
                // type: 触发器类型，目前仅支持 timer （即定时触发器）
                type: 'timer',
                // config: 触发器配置，在定时触发器下，config 格式为 cron 表达式
                config: '0 0 2 1 * * *'
            }
        ]
    })
    expect(res).toBe(undefined)

    const detail = await getFunctionDetail({
        envId,
        functionName: 'app'
    })

    expect(detail.Triggers.length).toBeGreaterThan(0)
})

test('删除触发器: function:trigger:delete', async () => {
    const res = await deleteFunctionTrigger({
        envId,
        functionName: 'app',
        triggerName: 'newTrigger'
    })

    expect(res).toBe(undefined)

    const detail = await getFunctionDetail({
        envId,
        functionName: 'app'
    })

    expect(detail.Triggers.length).toEqual(0)
})

test('触发函数: function:invoke', async () => {
    const res = await invokeFunction({
        envId,
        functionName: 'app',
        params: {
            a: 1
        }
    })

    expect(res.RetMsg).toEqual(
        JSON.stringify({
            a: 1
        })
    )
})

test('删除函数: function:delete', async () => {
    const res = await deleteFunction({
        envId,
        functionName: 'app'
    })

    expect(res).toBe(undefined)

    // 抛出资源不存在错误
    expect(
        (async () => {
            await getFunctionDetail({
                envId,
                functionName: 'app'
            })
        })()
    ).rejects.toThrowError()
})
