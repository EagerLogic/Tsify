import { NativeEntity } from './NativeEntity';
import { entity } from '@google-cloud/datastore/build/src/entity';
import { Key } from './Key';
import { IEntity, TId } from './IEntity';
export declare class ObjectMapper {
    static entity2native<$Entity extends IEntity<TId>>(e: $Entity): NativeEntity;
    static native2entity<$Entity extends IEntity<TId>>(data: any): $Entity;
    private static key2path;
    private static entity2data;
    static native2key(nk: entity.Key): Key<IEntity<TId>>;
    static key2native<$Entity extends IEntity<TId>>(key: Key<$Entity>): entity.Key;
    private constructor();
}
