import * as DS from '@google-cloud/datastore';
import { NativeEntity } from './NativeEntity';
import { entity } from '@google-cloud/datastore/build/src/entity';
import { Key, getEntityKind } from './Key';
import { Tsify } from './Tsify';
import { IEntity, TId, Long } from './IEntity';

const ds = new DS.Datastore();

export class ObjectMapper {

    public static entity2native<$Entity extends IEntity<TId>>(e: $Entity): NativeEntity {
        if (e == null) {
            throw new Error('The entity parameter can not be null');
        }

        var kind: string = getEntityKind(e).name;
        var factory = Tsify.getEntityFactoryByClassName(kind);
        if (factory == null) {
            throw new Error("Can't find registered IEntityFactory for kind: " + kind);
        }

        var res: NativeEntity = new NativeEntity();

        var key = Key.fromEntity(e);
        var keyOptions: entity.KeyOptions = {path: this.key2path(key)};
        
        if (e._namespace != null) {
            keyOptions.namespace = e._namespace;
        }


        res.key = ds.key(keyOptions);
        res.data = this.entity2data(e);
        if (e._excludeFromIndexes != null) {
            res.excludeFromIndexes = e._excludeFromIndexes;
        }

        return res;
    }

    public static native2entity<$Entity extends IEntity<TId>>(data: any): $Entity {
        var nk: entity.Key = data[ds.KEY];
        var factory = Tsify.getEntityFactoryByClassName(nk.kind);
        if (factory == null) {
            throw new Error("Can't find registered IEntityFactory for kind: " + nk.kind);
        }

        var res = factory.createEntity();

        var key: Key<$Entity> = this.native2key(nk) as Key<$Entity>;
        if (key.id != null) {
            res.id = key.id;
        } else {
            res.id = null;
        }
        if (key.namespace != null) {
            res._namespace = key.namespace;
        } else {
            delete res._namespace;
        }
        if (key.parent != null) {
            res._parent = key.parent;
        } else {
            delete res._parent;
        }
        
        var resa: any = res;
        

        for (var p in data) {
            if ((typeof p) != 'string') {
                continue;
            }
            if (p.startsWith('$')) {
                continue;
            }
            var v = data[p];
            var vt = typeof v;
            if (vt == 'function') {
                continue;
            }
            resa[p] = data[p];
        }

        return res as $Entity;
    }

    private static key2path(key: Key<IEntity<TId>>): any[] {
        var res: any[] = [];

        var ns = key.namespace;

        var k = key;
        while (k != null) {
            if (k.namespace != ns) {
                throw new Error('The parent entity must be in the same namespace as the entity itself!');
            }
            res.push(k.kind);
            if (k.id != null) {
                if (k.id instanceof Long) {
                    res.push(new entity.Int(k.id.value));
                } else if ((typeof k.id) == 'string') {
                    res.push(k.id);
                } else {
                    throw new Error('Invalid id type: ' + k.id);
                }
            }

            k = key.parent;
        }

        return res;
    }

    private static entity2data(e: IEntity<TId>): {} {
        var res = {};

        var exclude = ['_id', '_namespace', '_parent', '_excludeFromIndexes'];

        for (var p in e) {
            if ((typeof p) != 'string') {
                continue;
            }
            if (exclude.indexOf(p) > -1) {
                continue;
            }
            if (p.startsWith('$')) {
                continue;
            }

            var v = e[p];
            if (v == null) {
                continue;
            }
            var t = typeof v;
            t
            if (t == 'function' || t == 'symbol') {
                continue;
            }

            if (t == 'number') {
                if (v % 1 == 0) {
                    res[p] = ds.int(v);
                } else {
                    res[p] = ds.double(v);
                }
            } else if (v instanceof Key) {
                res[p] = this.key2path(v);
            } else {
                res[p] = v;
            }
            
        }

        return res;
    }

    public static native2key(nk: entity.Key): Key<IEntity<TId>> {
        if (nk == null) {
            return null;
        }

        var parent: Key<IEntity<TId>> = null;
        if (nk.parent != null) {
            parent = this.native2key(nk.parent);
        }

        var id: TId;
        if (nk.id != null) {
            id = new Long(nk.id);
        } else {
            id = nk.name;
        }

        return Key.createRaw(nk.kind, id, parent, nk.namespace);
        
    }

    public static key2native<$Entity extends IEntity<TId>>(key: Key<$Entity>): entity.Key {
        var keyOptions: entity.KeyOptions = {path: this.key2path(key)};
        if (key.namespace != null) {
            keyOptions.namespace = key.namespace;
        }
        var res = ds.key(keyOptions);

        return res;
    }

    private constructor() {}

}