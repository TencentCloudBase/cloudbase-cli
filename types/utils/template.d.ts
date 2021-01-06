export declare function downloadTemplate(options?: {
    appName?: string;
    newProject?: boolean;
    templateUri?: string;
    projectPath?: string;
}): Promise<string>;
export declare function extractTemplate(projectPath: string, templatePath: string, remoteUrl?: string): Promise<void>;
export declare function initProjectConfig(envId: string, region: string, projectPath?: string): Promise<void>;
