import { Key } from './Key';
import { IEntityFactory } from './IEntityFactory';
import { Transaction } from '@google-cloud/datastore/build/src/transaction';
import { IEntity, TId } from './IEntity';
export declare type Class<$Entity> = {
    new (...args: any[]): $Entity;
};
export interface IJob<$Result> {
    (transaction: Transaction, error: any): $Result;
}
export declare class Tsify {
    private static readonly entityFactories;
    static registerEntity<$T extends IEntity<TId>>(cls: Class<$T>, factory: IEntityFactory<$T>): void;
    static getEntityFactoryByClass<$T extends IEntity<TId>>(cls: Class<$T>): IEntityFactory<$T>;
    static getEntityFactoryByClassName<$T extends IEntity<TId>>(clsName: string): IEntityFactory<$T>;
    static save<$Entity extends IEntity<TId>>(entity: $Entity): Promise<Key<$Entity>>;
    static saveEntities(entities: IEntity<TId>[]): Promise<Key<IEntity<TId>>[]>;
    static findByKey<$Entity extends IEntity<TId>>(key: Key<$Entity>): Promise<$Entity>;
    static deleteByKey(key: Key<IEntity<TId>>): Promise<void>;
    static deleteByKeys(keys: Key<IEntity<TId>>[]): Promise<void>;
    static find<$Entity extends IEntity<TId>>(cls: Class<$Entity>, namespace?: string): Finder<$Entity>;
}
export declare type FilterOperator = "=" | "<" | "<=" | ">" | ">=";
export declare class Finder<$Entity extends IEntity<TId>> {
    private cls;
    private namespace;
    private filters;
    private orders;
    private anchestorKey;
    private limitCount;
    private offsetCount;
    constructor(cls: Class<$Entity>, namespace: string);
    anchestor(anchestorKey: Key<IEntity<TId>>): Finder<$Entity>;
    filter(property: string, operator: FilterOperator, value: any): Finder<$Entity>;
    orderBy(property: string, descending?: boolean): Finder<$Entity>;
    limit(count: number): Finder<$Entity>;
    offset(count: number): Finder<$Entity>;
    run(): Promise<$Entity[]>;
    runKeysOnly(): Promise<Key<$Entity>[]>;
    private buildQuery;
}
