import { Key, TId } from './Key';
export declare abstract class AEntity<$IdType extends TId> {
    private _key;
    private _excludeFromIndexes;
    constructor(namespace: string, id: $IdType, parent: Key<TId>, excludeFromIndexes: string[]);
    readonly kind: string;
    id: $IdType;
    parent: Key<TId>;
    readonly excludeFromIndexes: string[];
    readonly key: Key<$IdType>;
    readonly namespace: string;
}
