import { entity } from '@google-cloud/datastore/build/src/entity';
export declare class NativeEntity {
    key: entity.Key;
    data: {};
    excludeFromIndexes: string[];
}
