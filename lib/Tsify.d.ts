import { AEntity } from './AEntity';
import { TId, Key } from './Key';
import { IEntityFactory } from './IEntityFactory';
import { Transaction } from '@google-cloud/datastore/build/src/transaction';
export declare type Class<$Entity> = {
    new (...args: any[]): $Entity;
};
export interface IJob<$Result> {
    (transaction: Transaction, error: any): $Result;
}
export declare class Tsify {
    private static readonly entityFactories;
    static registerEntity<$T extends AEntity<TId>>(cls: Class<$T>, factory: IEntityFactory<$T>): void;
    static getEntityFactoryByClass<$T extends AEntity<TId>>(cls: Class<$T>): IEntityFactory<$T>;
    static getEntityFactoryByClassName<$T extends AEntity<TId>>(clsName: string): IEntityFactory<$T>;
    static save<$IdType extends TId>(entity: AEntity<$IdType>): Promise<Key<$IdType>>;
    static saveEntities<$IdType extends TId>(entities: AEntity<$IdType>[]): Promise<Key<$IdType>[]>;
    static findByKey<$IdType extends TId, $Entity extends AEntity<$IdType>>(key: Key<$IdType>): Promise<$Entity>;
    static deleteByKey(key: Key<TId>): Promise<void>;
    static deleteByKeys(keys: Key<TId>[]): Promise<void>;
    static find<$IdType extends TId, $Entity extends AEntity<$IdType>>(cls: Class<$Entity>, namespace: string): Finder<$IdType, $Entity>;
}
export declare type FilterOperator = "=" | "<" | "<=" | ">" | ">=";
export declare class Finder<$IdType extends TId, $Entity extends AEntity<$IdType>> {
    private cls;
    private namespace;
    private filters;
    private orders;
    private anchestorKey;
    private limitCount;
    private offsetCount;
    constructor(cls: Class<$Entity>, namespace: string);
    anchestor(anchestorKey: Key<TId>): Finder<$IdType, $Entity>;
    filter(property: string, operator: FilterOperator, value: any): Finder<$IdType, $Entity>;
    orderBy(property: string, descending?: boolean): Finder<$IdType, $Entity>;
    limit(count: number): Finder<$IdType, $Entity>;
    offset(count: number): Finder<$IdType, $Entity>;
    run(): Promise<$Entity[]>;
    runKeysOnly(): Promise<Key<$IdType>[]>;
    private buildQuery;
}
