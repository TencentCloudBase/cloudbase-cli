export * from './del';
export * from './compress';
export declare type SizeUnit = 'KB' | 'MB' | 'GB';
export declare function checkFullAccess(dest: string, throwError?: boolean): boolean;
export declare function checkWritable(dest: string, throwError?: boolean): boolean;
export declare function checkReadable(dest: string, throwError?: boolean): boolean;
export declare function isDirectory(dest: string): boolean;
export declare function formateFileSize(size: number | string, unit: SizeUnit): string;
