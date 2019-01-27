import { IEntity, TId } from './IEntity';
import { Class } from './Tsify';
export declare function getEntityKind<$Entity extends IEntity<TId>>(entity: $Entity): Class<$Entity>;
export declare class Key<$Entity extends IEntity<TId>> {
    static fromEntity<$Entity extends IEntity<TId>>(entity: $Entity): Key<$Entity>;
    static createNew<$Entity extends IEntity<TId>>(cls: Class<$Entity>, namespace: string): Key<$Entity>;
    static createNewWithParent<$Entity extends IEntity<TId>>(cls: Class<$Entity>, parent: Key<IEntity<TId>>, namespace: string): Key<$Entity>;
    static create<$Entity extends IEntity<TId>>(cls: Class<$Entity>, id: string, namespace: string): Key<$Entity>;
    static createWithParent<$Entity extends IEntity<TId>>(cls: Class<$Entity>, id: string, parent: Key<IEntity<TId>>, namespace: string): Key<$Entity>;
    static createRaw(kind: string, id: TId, parent: Key<IEntity<TId>>, namespace: string): Key<IEntity<TId>>;
    private _kind;
    private _id;
    private _parent;
    private _namespace;
    private constructor();
    readonly kind: string;
    readonly id: TId;
    readonly parent: Key<IEntity<TId>>;
    readonly namespace: string;
}
