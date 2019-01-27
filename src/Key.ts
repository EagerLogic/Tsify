import { entity } from '@google-cloud/datastore/build/src/entity';
import { IEntity, TId } from './IEntity';
import { Class } from './Tsify';

export function getEntityKind<$Entity extends IEntity<TId>>(entity: $Entity): Class<$Entity> {
    return entity.constructor as Class<$Entity>;
}

export class Key<$Entity extends IEntity<TId>> {

    public static fromEntity<$Entity extends IEntity<TId>>(entity: $Entity): Key<$Entity> {
        return new Key<$Entity>(getEntityKind(entity).name, entity.id, entity._parent, entity._namespace);
    }

    public static createNew<$Entity extends IEntity<TId>>(cls: Class<$Entity>, namespace: string): Key<$Entity> {
        return new Key<$Entity>(cls.name, null, null, namespace);
    }

    public static createNewWithParent<$Entity extends IEntity<TId>>(cls: Class<$Entity>, parent: Key<IEntity<TId>>, namespace: string): Key<$Entity> {
        return new Key<$Entity>(cls.name, null, parent, namespace);
    }

    public static create<$Entity extends IEntity<TId>>(cls: Class<$Entity>, id: string, namespace: string): Key<$Entity> {
        return new Key<$Entity>(cls.name, id, null, namespace);
    }

    public static createWithParent<$Entity extends IEntity<TId>>(cls: Class<$Entity>, id: string, parent: Key<IEntity<TId>>, namespace: string): Key<$Entity> {
        return new Key<$Entity>(cls.name, id, parent, namespace);
    }

    public static createRaw(kind: string, id: TId, parent: Key<IEntity<TId>>, namespace: string): Key<IEntity<TId>> {
        return new Key(kind, id, parent, namespace);
    }

    private _kind: string;
    private _id: TId;
    private _parent: Key<IEntity<TId>>;
    private _namespace: string;

    private constructor(kind: string, id: TId, parent: Key<IEntity<TId>>, namespace: string) {
        if (kind == null) {
            throw new Error('The kind parameter is mandatory!');
        }
        this._kind = kind;

        if (id != null) {
            this._id = id;
        }

        if (parent != null) {
            this._parent = parent;
        }

        if (namespace != null) {
            this._namespace = namespace;
        }
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