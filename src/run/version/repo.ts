import { CloudApiService } from '../../utils'
import {
    IListCodeRepo,
    IListBranch
} from '../../types'

const tcbService = CloudApiService.getInstance('tcb')

export const listRepo = async (options: IListCodeRepo) => {
    const { IsFinished, RepoList, Error } = await tcbService.request('DescribeCloudBaseCodeRepos', {
        Channel: options.channel,
        PageNumber: options.pageNumber,
        PageSize: options.pageSize
    })

    return { IsFinished, RepoList, Error }
}

export const listBranch = async (options: IListBranch) => {
    const { IsFinished, BranchList } = await tcbService.request('DescribeCloudBaseCodeBranch', {
        Channel: options.channel,
        PageNumber: options.pageNumber,
        PageSize: options.pageSize,
        RepoName: options.repoName
    })

    return { IsFinished, BranchList }
}