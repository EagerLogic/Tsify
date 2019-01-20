import { entity } from '@google-cloud/datastore/build/src/entity';


export class NativeEntity {

    public key: entity.Key;
    public data: {};
    public excludeFromIndexes: string[];

}