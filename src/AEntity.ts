// import { Key, TId } from './Key';
// import { entity } from '@google-cloud/datastore/build/src/entity';
// import { IEntity } from './IEntity';

// export abstract class AEntity implements IEntity {

//     private _namespace: string;
//     private _parent: Key<AEntity>;
//     private _excludeFromIndexes: string[] = [];

//     public constructor(namespace: string, id: TId, parent: Key<TId>, excludeFromIndexes: string[]) {
//         this._namespace = namespace;

//         this.parent = parent;

//         if (excludeFromIndexes == null) {
//             excludeFromIndexes = [];
//         }
//         this._excludeFromIndexes = excludeFromIndexes;
        
//     }

//     public get kind(): string {
//         return this.constructor.toString().match(/\w+/g)[1];
//     }

//     public get id(): $IdType {
//         return this._key.id;
//     }

//     public set id(id: $IdType) {
//         this._key = Key.createWithParent(this.kind, id, this.parent, this.namespace);
//     }

//     public get parent(): Key<TId> {
//         return this._key.parent;
//     }

//     public set parent(parent: Key<TId>) {
//         this._key = Key.createWithParent(this.kind, this.id, parent, this.namespace);
//     }

//     public get excludeFromIndexes() {
//         return this._excludeFromIndexes.filter(() => {return true;});
//     }

//     public get key(): Key<$IdType> {
//         return Key.fromEntity(this);
//     }

//     public get namespace() {
//         return this._key.namespace;
//     }

// }