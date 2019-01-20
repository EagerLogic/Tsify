import { AEntity } from './AEntity';
import { TId, Key } from './Key';
import { IEntityFactory } from './IEntityFactory';
import * as DS from '@google-cloud/datastore';
import { ObjectMapper } from './ObjectMapper';
import { resolve } from 'url';
import { NativeEntity } from './NativeEntity';
import { entity, Entity } from '@google-cloud/datastore/build/src/entity';
import { Query } from '@google-cloud/datastore/build/src/query';
import { Transaction } from '@google-cloud/datastore/build/src/transaction';

const ds = new DS.Datastore();

export type Class<$Entity> = { new(...args: any[]): $Entity; }

export interface IJob<$Result> {
    (transaction: Transaction, error: any): $Result;
}

export class Tsify {

    private static readonly entityFactories: { [name: string]: IEntityFactory<AEntity<TId>> } = {};

    public static registerEntity<$T extends AEntity<TId>>(cls: Class<$T>, factory: IEntityFactory<$T>): void {
        if (cls == null) {
            throw new Error('The cls parameter can not be null!');
        }
        if (cls.name == null) {
            throw new Error('The given cls parameter is not a class!');
        }
        if (factory == null) {
            throw new Error('The factory parameter can not be null!');
        }
        this.entityFactories[cls.name] = factory;
    }

    public static getEntityFactoryByClass<$T extends AEntity<TId>>(cls: Class<$T>): IEntityFactory<$T> {
        return this.getEntityFactoryByClassName(cls.name);
    }

    public static getEntityFactoryByClassName<$T extends AEntity<TId>>(clsName: string): IEntityFactory<$T> {
        return this.entityFactories[clsName] as IEntityFactory<$T>;
    }

    public static async save<$IdType extends TId>(entity: AEntity<$IdType>): Promise<Key<$IdType>> {
        var nEntity = ObjectMapper.entity2native(entity);

        var res = new Promise<Key<$IdType>>((resolve, reject) => {
            ds.save(nEntity, (err) => {
                if (err != null) {
                    reject(err);
                    return;
                }

                if (nEntity.key.id != null) {
                    entity.id = nEntity.key.id as $IdType;
                } else {
                    entity.id = nEntity.key.name as $IdType;
                }

                resolve(Key.fromEntity(entity));
            });
        });

        return res;
    }

    public static async saveEntities<$IdType extends TId>(entities: AEntity<$IdType>[]): Promise<Key<$IdType>[]> {
        var nEntities: NativeEntity[] = [];
        for (var e of entities) {
            nEntities.push(ObjectMapper.entity2native(e));
        }

        var res = new Promise<Key<$IdType>[]>((resolve, reject) => {
            ds.save(nEntities, (err) => {
                if (err != null) {
                    reject(err);
                    return;
                }

                var res: Key<$IdType>[] = []
                for (var i = 0; i < nEntities.length; i++) {
                    var nEntity = nEntities[i];

                    if (nEntity.key.id != null) {
                        entities[i].id = nEntity.key.id as $IdType;
                    } else {
                        entities[i].id = nEntity.key.name as $IdType;
                    }

                    res.push(Key.fromEntity(entities[i]));
                }

                resolve(res);
            });
        });

        return res;
    }

    public static async findByKey<$IdType extends TId, $Entity extends AEntity<$IdType>>(key: Key<$IdType>): Promise<$Entity> {
        return new Promise<$Entity>(async (resolve, reject) => {
            try {
                var nres = await ds.get(ObjectMapper.key2native(key));
                if (nres.length < 1) {
                    resolve(null);
                }
                resolve(ObjectMapper.native2entity(nres[0]) as $Entity);
            } catch (e) {
                reject(e);
            }

        });
    }

    public static async deleteByKey(key: Key<TId>): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            ds.delete(ObjectMapper.key2native(key), (err) => {
                if (err != null) {
                    reject(err);
                }
                resolve();
            });
        });
    }

    public static async deleteByKeys(keys: Key<TId>[]): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            var nkeys: entity.Key[] = [];
            for (var k of keys) {
                nkeys.push(ObjectMapper.key2native(k));
            }
            ds.delete(nkeys, (err) => {
                if (err != null) {
                    reject(err);
                }
                resolve();
            });
        });
    }

    public static find<$IdType extends TId, $Entity extends AEntity<$IdType>>(cls: Class<$Entity>, namespace: string): Finder<$IdType, $Entity> {
        return new Finder<$IdType, $Entity>(cls, namespace);
    }

}

export type FilterOperator = "=" | "<" | "<=" | ">" | ">=";

export class Finder<$IdType extends TId, $Entity extends AEntity<$IdType>> {

    private cls: Class<$Entity>;
    private namespace: string;
    private filters: { property: string, operator: FilterOperator, value: any }[] = [];
    private orders: { property: string, descending: boolean }[] = [];
    private anchestorKey: Key<TId> = null;
    private limitCount: number = null;
    private offsetCount: number = null;

    public constructor(cls: Class<$Entity>, namespace: string) {
        this.cls = cls;
        this.namespace = namespace;
    }

    public anchestor(anchestorKey: Key<TId>): Finder<$IdType, $Entity> {
        this.anchestorKey = anchestorKey;
        return this;
    }

    public filter(property: string, operator: FilterOperator, value: any): Finder<$IdType, $Entity> {
        this.filters.push({ property: property, operator: operator, value: value });
        return this;
    }

    public orderBy(property: string, descending?: boolean): Finder<$IdType, $Entity> {
        this.orders.push({ property: property, descending: descending });
        return this;
    }

    public limit(count: number): Finder<$IdType, $Entity> {
        if (count == null) {
            this.limitCount = null;
        }
        count = count | 0;
        if (count < 1) {
            this.limitCount = null;
        }

        this.limitCount = count;

        return this;
    }

    public offset(count: number): Finder<$IdType, $Entity> {
        if (count == null) {
            this.offsetCount = null;
        }
        count = count | 0;
        if (count < 1) {
            this.offsetCount = null;
        }

        this.offsetCount = count;

        return this;
    }

    public async run(): Promise<$Entity[]> {
        return new Promise<$Entity[]>(async (resolve, reject) => {
            var q = this.buildQuery();

            try {
                var [nres] = await ds.runQuery(q);
                var res: $Entity[] = [];
                for (var nr of nres) {
                    res.push(ObjectMapper.native2entity(nr));
                }
                resolve(res);
            } catch (e) {
                reject(e);
            }
        });
    }

    public async runKeysOnly(): Promise<Key<$IdType>[]> {
        return new Promise<Key<$IdType>[]>(async (resolve, reject) => {
            var q = this.buildQuery();
            q = q.select("__key__");

            try {
                var [nres] = await ds.runQuery(q);
                var res: Key<$IdType>[] = [];
                for (var nr of nres) {
                    res.push(ObjectMapper.native2key(nr) as Key<$IdType>);
                }
                resolve(res);
            } catch (e) {
                reject(e);
            }
        });
    }

    private buildQuery(): Query {
        var q: Query;
        if (this.namespace != null) {
            if (this.cls != null) {
                q = ds.createQuery(this.namespace, this.cls.name);
            } else {
                q = ds.createQuery(this.namespace, null);
            }
        } else {
            if (this.cls != null) {
                q = ds.createQuery(this.cls.name);
            } else {
                q = ds.createQuery(undefined);
            }
        }

        if (this.anchestorKey != null) {
            q = q.hasAncestor(ObjectMapper.key2native(this.anchestorKey));
        }

        for (var f of this.filters) {
            q = q.filter(f.property, f.operator, f.value);
        }

        for (var o of this.orders) {
            q = q.order(o.property, { descending: o.descending });
        }

        if (this.limitCount != null) {
            q = q.limit(this.limitCount);
        }

        if (this.offsetCount != null) {
            q.offset(this.offsetCount);
        }

        return q;
    }
}