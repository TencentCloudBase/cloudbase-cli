import { ICommandContext } from '../command'
import { loadingFactory } from '../../utils'
import { deleteThirdPartAttach } from '../../third'

export async function deleteThirdAttach(ctx: ICommandContext){
    const { options } = ctx
    const { source, thirdAppId } = options

    let typeFlag
    if(source === 'qq'){
        typeFlag = 1
    }

    if(!typeFlag){
        throw new Error('请指定对应的source')
    }

    const loading = loadingFactory()
    loading.start('数据加载中...')
    const data = await deleteThirdPartAttach({
        TypeFlag: typeFlag,
        ThirdPartAppid: thirdAppId
    })
    loading.stop()
    console.log(data)
}