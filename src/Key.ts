import { entity } from '@google-cloud/datastore/build/src/entity';
import { AEntity } from './AEntity';

export type TId = string | entity.Int;

export class Key<$IdType extends TId> {

    public static fromEntity<$IdType extends TId>(entity: AEntity<$IdType>): Key<$IdType> {
        return new Key<$IdType>(entity.kind, entity.id, entity.parent, entity.namespace);
    }

    public static createNew(kind: string, namespace: string): Key<entity.Int> {
        return new Key<entity.Int>(kind, null, null, namespace);
    }

    public static createNewWithParent(kind: string, parent: Key<TId>, namespace: string): Key<entity.Int> {
        return new Key<entity.Int>(kind, null, parent, namespace);
    }

    public static create<$IdType extends TId>(kind: string, id: $IdType, namespace: string): Key<$IdType> {
        return new Key<$IdType>(kind, id, null, namespace);
    }

    public static createWithParent<$IdType extends TId>(kind: string, id: $IdType, parent: Key<TId>, namespace: string): Key<$IdType> {
        return new Key<$IdType>(kind, id, parent, namespace);
    }

    private _kind: string;
    private _id: $IdType;
    private _parent: Key<TId>;
    private _namespace: string;

    private constructor(kind: string, id: $IdType, parent: Key<TId>, namespace: string) {
        if (kind == null) {
            throw new Error('The kind parameter is mandatory!');
        }

        kind = kind.trim();
        if (kind.length < 1) {
            throw new Error('The kind parameter can not be an empty string!');
        }

        this._kind = kind;

        this._id = id;

        this._parent = parent;

        this._namespace = namespace;
    }

    public get kind() {
        return this._kind;
    }

    public get id() {
        return this._id;
    }

    public get parent() {
        return this._parent;
    }

    public get namespace() {
        return this._namespace;
    }

}