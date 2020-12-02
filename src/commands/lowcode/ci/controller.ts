import Koa from 'koa'
import BodyParser from 'koa-bodyparser'
import Router from '@koa/router'
import Cors from '@koa/cors'
import { resolve as resolvePath } from 'path'
import { Builder, Watcher } from './service'
import chalk from 'chalk'
import os from 'os'

const WORKSPACE = resolvePath(os.homedir(), 'cloudbase-lowcode/builds')
const SYNC_HISTORY_FLAG = false

const app = new Koa()
const router = new Router()
const parser = BodyParser({
  jsonLimit: '5mb'
})
const cors = new Cors()
const builder = new Builder(resolvePath(process.cwd(), WORKSPACE))
const watcher = new Watcher(resolvePath(process.cwd(), WORKSPACE))

router.post('/v1/build', async (ctx, next) => {
  watcher.start()

  // @ts-ignore bodyparser注入了body
  const params = ctx.request.body

  const validated = validate(ctx, params, {
    envId: 'string',
    appId: 'string',
  })

  if(validated) {
    const result = await builder.build(ctx, params)
    const fixedResult = { 
      ...result, 
      ciId: result.buildId 
    }

    ctx.response.body = {
      data: fixedResult,
      errcode: 0
    }
  }

  await next()
})

router.post('/v1/checkStatus', async (ctx, next) => {
  // @ts-ignore bodyparser注入了body
  const params = ctx.request.body
  const fixedParams = params && { 
    ...params, 
    buildId: params.ciId 
  }

  const validated = validate(ctx, fixedParams, {
    envId: 'string',
    appId: 'string',
    ciId: 'string',
    distType: 'object'
  })

  if (validated) {
    const result = await builder.checkStatusInLocal(ctx, fixedParams)
    
    ctx.response.body = {
      data: result,
      errcode: 0
    }
  }

  await next()
})

router.post('/v1/ping', async (ctx, next) => {
  watcher.start()
  
  ctx.response.body = {
    data: {
      isReady: true,
      syncHistory: SYNC_HISTORY_FLAG
    },
    errcode: 0
  }

  await next()
})

router.post('/v1/deployHistory', async (ctx, next) => {
  // @ts-ignore bodyparser注入了body
  const params = ctx.request.body

  const validated = validate(ctx, params, {
    envId: 'string',
    appId: 'string',
    pageSize: 'number',
    pageIndex: 'number'
  })

  if (validated) {
    const result = await builder.deployHistory(ctx, params)

    ctx.response.body = {
      data: result,
      errcode: 0
    }
  }

  await next()
})

router.post('/v1/deployHistory/detail', async (ctx, next) => {
  // @ts-ignore bodyparser注入了body
  const params = ctx.request.body

  const validated = validate(ctx, params, {
    envId: 'string',
    appId: 'string',
    idx: 'string'
  })

  if (validated) {
    const result = await builder.deployDetail(ctx, params)

    ctx.response.body = {
      data: result,
      errcode: 0
    }
  }


  await next()
})

app.use(cors)
app.use(parser)
app.use(router.routes())

export async function startLocalCIServer(port) {
  return new Promise((resolve, reject) => {
    const server = app.listen(port)
    server.on('error', (e) => reject(e))
    server.on('close', () => resolve(null))

    console.log(chalk.green('\n[云开发低码] 成功开启本地构建模式\n'))
  })  
}

function validate(ctx, data, rules) {
  for(const key in rules) {
    if (!data[key]) {
      ctx.response.body = {
        errcode: 1,
        errmsg: `invalid params: ${key} is required !`
      }
      return false
    } else if(typeof data[key] !== rules[key]) {
      ctx.response.body = {
        errcode: 1,
        errmsg: `invalid params: ${key} should be type of ${rules[key]}`
      }
      return false
    }
  }
  return true
}