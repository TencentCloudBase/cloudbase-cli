import { ParamTypes } from '../constants';
declare type GetterFunction = (target: any) => Promise<any> | any;
export declare const createParamDecorator: (paramtype: ParamTypes, getter: GetterFunction) => () => (target: any, key: string | symbol, index: number) => void;
export {};
