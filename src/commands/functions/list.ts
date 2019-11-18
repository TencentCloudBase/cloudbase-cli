import { CloudBaseError } from '../../error'
import {
    listFunction
} from '../../function'
import { FunctionContext } from '../../types'
import { printHorizontalTable } from '../../utils'

const StatusMap = {
    Active: '部署完成',
    Creating: '创建中',
    CreateFailed: '创建失败',
    Updating: '更新中',
    UpdateFailed: '更新失败'
}

export async function list(ctx: FunctionContext, options) {
    const { envId } = ctx
    let { limit = 20, offset = 0 } = options
    limit = Number(limit)
    offset = Number(offset)
    if (!Number.isInteger(limit) || !Number.isInteger(offset)) {
        throw new CloudBaseError('limit 和 offset 必须为整数')
    }

    if (limit < 0 || offset < 0) {
        throw new CloudBaseError('limit 和 offset 必须为大于 0 的整数')
    }

    const data = await listFunction({
        envId,
        limit: Number(limit),
        offset: Number(offset)
    })

    const head: string[] = [
        'Id',
        'Name',
        'Runtime',
        'AddTime',
        'ModTime',
        'Status'
    ]

    const tableData = data.map(item => [
        item.FunctionId,
        item.FunctionName,
        item.Runtime,
        item.AddTime,
        item.ModTime,
        StatusMap[item.Status]
    ])

    printHorizontalTable(head, tableData)
}
