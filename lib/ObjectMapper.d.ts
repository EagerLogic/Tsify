import { NativeEntity } from './NativeEntity';
import { AEntity } from './AEntity';
import { entity } from '@google-cloud/datastore/build/src/entity';
import { TId, Key } from './Key';
export declare class ObjectMapper {
    static entity2native<$T extends AEntity<TId>>(e: $T): NativeEntity;
    static native2entity<$T extends AEntity<TId>>(data: any): $T;
    private static key2path;
    private static entity2data;
    static native2key(nk: entity.Key): Key<TId>;
    static key2native<$IdType extends TId>(key: Key<$IdType>): entity.Key;
    private constructor();
}
