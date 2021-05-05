import { IListCodeRepo, IListBranch } from '../../types';
export declare const listRepo: (options: IListCodeRepo) => Promise<{
    IsFinished: any;
    RepoList: any;
    Error: any;
}>;
export declare const listBranch: (options: IListBranch) => Promise<{
    IsFinished: any;
    BranchList: any;
}>;
