import { Key } from './Key';
import { entity } from '@google-cloud/datastore/build/src/entity';

export class Long {

    private _value: string;

    public constructor(value: string) {
        if (value == null) {
            throw new Error('The value parameter can not be null!');
        }
        this._value = value;
    }

    public get value() {
        return this._value;
    }

}

export type TId = string | Long;

export interface IEntity<$Id extends TId> {

    id: $Id;
    _namespace?: string;
    _parent?: Key<IEntity<TId>>;
    _excludeFromIndexes?: string[];

}