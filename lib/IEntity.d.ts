import { Key } from './Key';
export declare class LongId {
    private _value;
    constructor(value: string);
    readonly value: string;
}
export declare type TId = string | LongId;
export interface IEntity<$Id extends TId> {
    id: $Id;
    _namespace?: string;
    _parent?: Key<IEntity<TId>>;
    _excludeFromIndexes?: string[];
}
