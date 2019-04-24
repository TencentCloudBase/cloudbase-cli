# Cloudbase命令行工具

## 安装

```bash
npm install -g @cloudbase/cli
```

## 使用方法
```bash
tcb -h
```
```
Usage: tcb [options] [command]

Options:
  -V, --version            output the version number
  -h, --help               output usage information

Commands:
  deploy [options] [name]  执行完整的发布
  login                    登录腾讯云账号
  logout                   登出腾讯云账号
  show                     查看状态
  logs [options] <name>    查看日志
```

### 发布

执行完整的发布

```
tcb deploy [--start]
```
参数：

* `--start`：是否需要启动

### 查看日志

```
tcb show [-n 20] <name>
```

参数：
* `-n`：日志的行数


## tcb.json

cli的配置文件

示例：

```json
{
    "deploys": [
        {
            "name": "app",
            "type": "node",
            "path": "./server"
        }
    ]
}
```

### deploys

数组，包含项目的发布配置

示例：

```js
{
    "deploys": [
        // 云函数示例
        {
            "name": "add",
            "type": "function",
            "path": "./",
            "envId": "test-e48fe1",
            "override": true
        },

        // Node服务示例
        {
            "name": "app",
            "type": "node",
            "path": "./server"
        },

        // Vemo项目示例
        {
            name: 'my-vemo',
            type: 'node',
            path: './vemo-server'
        }
    ]
}
```