export default class Builder {
    constructor(options: any);
    build(entry: any): Promise<IBuildResult>;
    watch(entry: any): void;
}
export interface IBuildResult {
    success: Boolean;
    assets: Array<string>;
}
