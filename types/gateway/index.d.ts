import { ICreateFunctionGatewayOptions, IQueryGatewayOptions, IDeleteGatewayOptions, IBindGatewayDomainOptions, IQueryGatewayDomainOptions, IUnbindGatewayDomainOptions } from '../types';
export declare function createFunctionGateway(options: ICreateFunctionGatewayOptions): Promise<any>;
export declare function queryGateway(options: IQueryGatewayOptions): Promise<any>;
export declare function deleteGateway(options: IDeleteGatewayOptions): Promise<any>;
export declare function bindGatewayDomain(options: IBindGatewayDomainOptions): Promise<any>;
export declare function queryGatewayDomain(options: IQueryGatewayDomainOptions): Promise<any>;
export declare function unbindGatewayDomain(options: IUnbindGatewayDomainOptions): Promise<any>;
