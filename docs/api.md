# API 接口

## 使用

```js
const Client = require('@cloudbase/cli')
// 如果已使用 tcb login 登录过，可以不传入 secretId、secretKey 值
const client = new Client(secretId, secretKey)

client
    .env
    .list()
    .then(function(data) {
        console.log(data)
    })
    .catch(function(err) {
    })
```

## Client 类方法

#### env.list()

参数： 无

响应：void

#### function.invoke(options)

参数：

```js
{
    envId: string,
    functionName: string,
    params: {
        a: 1
    }
}
```

响应：

```js
{
    Log: '',
    RetMsg: '{"a":1}', // 响应结果，JSON 字符串，可使用 JSON.parse() 方法序列化为对象
    ErrMsg: '',
    MemUsage: 217088,
    Duration: 2.569999933242798,
    BillDuration: 100,
    FunctionRequestId: 'e9ba6ddc-b828-11e9-9290-52540029942f',
    InvokeResult: 0 
}
```

#### function.deploy(options)

参数：

```js
{
    envId: string,
    functionName: string,
    force: boolean,
    // 函数代码 base64 编码形式
    zipFile: base64String,
    func: {
        // 函数名
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
    }
}
```

响应：void

#### function.list(options)

参数：

```js
{
    envId: string
}
```

响应：

```js
[
    { 
        FunctionName: 'app',
        Runtime: 'Nodejs8.9',
        AddTime: '2019-08-05 16:33:22',
        Description: '' 
    },
    { 
        FunctionName: 'test-scf',
        Runtime: 'Nodejs8.9',
        AddTime: '2019-07-02 16:40:41',
        Description: ''
    }
]
```

#### function.delete(options)

参数：

```js
{
    envId: string,
    functionName: string
}
```

响应：void

#### function.detail(options)

参数：

```js
{
    envId: string,
    functionName: string,
    offset?: number,
    limit?: number,
    order?: string,
    orderBy?: string,
    startTime?: string,
    endTime?: string,
    functionRequestI?: string
}
```

响应：

```js
{
    ModTime: '2019-08-05 16:46:39',
    Description: '',
    Handler: 'index.main',
    CodeSize: 636,
    Timeout: 5,
    FunctionVersion: '$LATEST',
    MemorySize: 256,
    Runtime: 'Nodejs8.9',
    FunctionName: 'app',
    Environment: { 
        Variables: [
            { Key: '', Value: '' }
        ] 
    },
    Namespace: 'dev-97eb6c',
    Status: 'Active',
    Triggers: [
        {
            ModTime: '2019-08-05 20:15:35',
            Type: 'timer',
            TriggerDesc: '{"cron": "0 0 2 1 * * *"}',
            TriggerName: 'myTrigger',
            AddTime: '2019-08-05 20:15:35',
            Enable: 1,
            CustomArgument: '' 
        } 
    ]
}
```

#### function.log(options)

参数：

```js
{
    envId: string,
    functionName: string
}
```

响应：

```js
[
    { 
        FunctionName: 'test-scf',
        RetMsg: '{"key":"test","userInfo":{"appId":"wx9c4c30a432a38ebc","openId":"on01a6UeSuBLGTQpc_PAjS_RK_4o"}}',
        RequestId: '68649b0f-af84-11e9-a803-525400e8849e',
        StartTime: '2019-07-26 17:04:43',
        RetCode: 0,
        InvokeFinished: 1,
        Duration: 0.44,
        BillDuration: 100,
        MemUsage: 131072,
        Log: ''
    }
]
```

#### function.config.update(options)

参数：

```js
{
    envId: string,
    functionName: string,
    config: {
        // 超时时间
        timeout: 6,
        // 环境变量
        envVariables: {
            key: 'value',
            akey: 'c'
        }
    }
}
```

响应：void

#### function.trigger.create(options)

参数：

```js
{
    envId: string,
    functionName: string,
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
}
```

响应：void

#### function.trigger.delete(options)

参数：

```js
{
    envId: 'dev-97eb6c',
    functionName: 'app',
    triggerName: 'myTrigger'
}
```

响应：void
