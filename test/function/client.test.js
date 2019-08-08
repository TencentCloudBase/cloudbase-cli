const Client = require('../../lib')

const client = new Client()
const { functions } = client

const envId = 'dev-97eb6c'

test('列出所有函数: functions:list', async () => {
    const data = await functions.list({
        envId
    })

    expect(data.length).toBeGreaterThanOrEqual(1)
})

test('列出所有函数: functions:list --offset', async () => {
    const data = await functions.list({
        envId,
        offset: 1
    })

    expect(data.length).toBeGreaterThanOrEqual(0)
})

test('列出所有函数: functions:list --limit', async () => {
    const data = await functions.list({
        envId,
        limit: 1
    })

    expect(data.length).toBe(1)
})

test('deploy function', async () => {
    const res = await functions.deploy({
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

test('获取函数详情: functions:detail', async () => {
    const detail = await functions.detail({
        envId,
        functionName: 'app'
    })

    expect(detail.FunctionName).toEqual('app')
    expect(detail.MemorySize).toEqual(256)
})

test('获取函数日志: functions:log', async () => {
    const logs = await functions.log({
        envId,
        functionName: 'app'
    })

    expect(logs.length).toBeGreaterThanOrEqual(0)
})

test('获取函数日志: functions:log', async () => {
    const logs = await functions.log({
        envId,
        functionName: 'app'
    })

    expect(logs.length).toEqual(0)
})

test('更新函数配置: functions:config:update', async () => {
    await functions.config.update({
        envId,
        functionName: 'app',
        config: {
            timeout: 6
        }
    })

    const detail = await functions.detail({
        envId,
        functionName: 'app'
    })

    expect(detail.Timeout).toEqual(6)
})

test('创建触发器: functions:trigger:create', async () => {
    const res = await functions.trigger.create({
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

    const detail = await functions.detail({
        envId,
        functionName: 'app'
    })

    expect(detail.Triggers.length).toBeGreaterThan(0)
})

test('删除触发器: functions:trigger:delete', async () => {
    const res = await functions.trigger.delete({
        envId,
        functionName: 'app',
        triggerName: 'newTrigger'
    })

    expect(res).toBe(undefined)

    const detail = await functions.detail({
        envId,
        functionName: 'app'
    })

    expect(detail.Triggers.length).toEqual(0)
})

test('触发函数: functions:invoke', async () => {
    const res = await functions.invoke({
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

test('删除函数: functions:delete', async () => {
    const res = await functions.delete({
        envId,
        functionName: 'app'
    })

    expect(res).toBe(undefined)

    // 抛出资源不存在错误
    expect(
        (async () => {
            await functions.detail({
                envId,
                functionName: 'app'
            })
        })()
    ).rejects.toThrowError()
})
