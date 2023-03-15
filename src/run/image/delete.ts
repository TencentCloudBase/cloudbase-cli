import { CloudApiService } from '../../utils'
import { IDeleteImage } from '../../types'
import { option } from 'yargs'

const tcbService = CloudApiService.getInstance('tcb')

export const deleteImage = async (options: IDeleteImage) => {
    const { Result } = await tcbService.request('DeleteCloudBaseRunImage', {
        EnvId: options.envId,
        ImageUrl: options.imageUrl
    })

    return Result
}