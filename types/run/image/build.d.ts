import { IBuildImage } from '../../types';
export declare const createBuild: (options: IBuildImage) => Promise<{
    PackageName: any;
    PackageVersion: any;
    UploadHeaders: any;
    UploadUrl: any;
}>;
export declare const uploadZip: (path: string, url: string, headers: {
    [key: string]: string;
}) => Promise<void>;
