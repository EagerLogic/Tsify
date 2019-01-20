import { Key, TId } from './Key';

export abstract class AEntity<$IdType extends TId> {

    private _key: Key<$IdType>
    private _excludeFromIndexes: string[] = [];

    public constructor(namespace: string, id: $IdType, parent: Key<TId>, excludeFromIndexes: string[]) {
        this._key = Key.createWithParent(this.kind, id, parent, namespace);

        this.parent = parent;

        if (excludeFromIndexes == null) {
            excludeFromIndexes = [];
        }
        this._excludeFromIndexes = excludeFromIndexes;
        
    }

    public get kind(): string {
        return this.constructor.toString().match(/\w+/g)[1];
    }

    public get id(): $IdType {
        return this._key.id;
    }

    public set id(id: $IdType) {
        this._key = Key.createWithParent(this.kind, id, this.parent, this.namespace);
    }

    public get parent(): Key<TId> {
        return this._key.parent;
    }

    public set parent(parent: Key<TId>) {
        this._key = Key.createWithParent(this.kind, this.id, parent, this.namespace);
    }

    public get excludeFromIndexes() {
        return this._excludeFromIndexes.filter(() => {return true;});
    }

    public get key(): Key<$IdType> {
        return Key.fromEntity(this);
    }

    public get namespace() {
        return this._key.namespace;
    }

}