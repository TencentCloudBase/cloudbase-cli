import { prompt } from 'enquirer'
import { CloudBaseError } from '../../error'

/**
 * @描述 分页的选择型 prompt
 * @泛型参数 O: listFetcher 的参数类型
 * @参数 listFetcher: 执行列表拉取逻辑的函数，一般认为参数 options 至少拥有 limit 和 offset 两个 number 属性
 * @参数 options: listFetcher 的参数
 * @参数 message: 展示的信息
 * @参数 filter 筛选返回列表的数据
 * @参数 mapper 对返回列表中元素的处理函数，用于处理列表数据到实际展示列表的映射
 * @返回值 select 类型返回 string，multiselect 返回 string[]
 */
export const pagingSelectPromp =
    async <T, O extends { limit?: number, offset?: number }>(
        type: 'select' | 'multiselect',
        listFetcher: (options: O) => Promise<any[]>,
        options: O,
        message: string,
        filter: (item: any) => boolean = _ => true,
        mapper: (item: any) => string = item => item) => {

        let res: string[] | string = []

        let offset = 0
        let nextRoundList: string[]


        while (true) {
            const thisRoundList = nextRoundList || (await listFetcher({ ...options, limit: 10, offset: offset })).filter(filter).map(mapper)
            offset += 10
            nextRoundList = (await listFetcher({ ...options, limit: 10, offset: offset })).filter(filter).map(mapper)

            if (!thisRoundList || !thisRoundList.length)
                throw new CloudBaseError('列表没有数据')

            if (type === 'select') {
                let receiver: string = (await prompt<any>({
                    type: type,
                    name: 'receiver',
                    message: message,
                    choices: nextRoundList?.length ? [...thisRoundList, '下一页'] : [...thisRoundList]
                })).receiver
                res = receiver
                if (receiver !== '下一页') break
            } else {
                let { receiver }: { receiver: string[] } = await prompt<any>({
                    type: type,
                    name: 'receiver',
                    message: message,
                    choices: nextRoundList?.length ? [...thisRoundList, '下一页'] : [...thisRoundList]
                })
                if (!receiver) receiver = []
                res = [...res, ...receiver.filter(item => item !== '下一页')]
                if (receiver.indexOf('下一页') === -1) break
            }
        }

        return res
    }