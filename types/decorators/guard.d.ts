export interface AuthGuardOptions {
    tips?: string;
    ensureConfig?: boolean;
}
export declare const AuthGuard: (options?: AuthGuardOptions) => MethodDecorator;
