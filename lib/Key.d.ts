import { entity } from '@google-cloud/datastore/build/src/entity';
import { AEntity } from './AEntity';
export declare type TId = string | entity.Int;
export declare class Key<$IdType extends TId> {
    static fromEntity<$IdType extends TId>(entity: AEntity<$IdType>): Key<$IdType>;
    static createNew(kind: string, namespace: string): Key<entity.Int>;
    static createNewWithParent(kind: string, parent: Key<TId>, namespace: string): Key<entity.Int>;
    static create<$IdType extends TId>(kind: string, id: $IdType, namespace: string): Key<$IdType>;
    static createWithParent<$IdType extends TId>(kind: string, id: $IdType, parent: Key<TId>, namespace: string): Key<$IdType>;
    private _kind;
    private _id;
    private _parent;
    private _namespace;
    private constructor();
    readonly kind: string;
    readonly id: $IdType;
    readonly parent: Key<TId>;
    readonly namespace: string;
}
