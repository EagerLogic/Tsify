import * as DS from '@google-cloud/datastore';
import { NativeEntity } from './NativeEntity';
import { AEntity } from './AEntity';
import { entity } from '@google-cloud/datastore/build/src/entity';
import { TId, Key } from './Key';
import { Tsify } from './Tsify';

const ds = new DS.Datastore();

export class ObjectMapper {

    public static entity2native<$T extends AEntity<TId>>(e: $T): NativeEntity {
        if (e == null) {
            throw new Error('The entity parameter can not be null');
        }

        var res: NativeEntity = new NativeEntity();

        var keyOptions: entity.KeyOptions = {path: this.key2path(e.key)};
        if (e.namespace != null) {
            keyOptions.namespace = e.namespace;
        }
        res.key = new entity.Key(keyOptions);
        res.data = this.entity2data(e);
        res.excludeFromIndexes = e.excludeFromIndexes;

        return res as NativeEntity;
    }

    public static native2entity<$T extends AEntity<TId>>(data: any): $T {
        
        var nk: entity.Key = data[ds.KEY];
        var factory = Tsify.getEntityFactoryByClassName(nk.kind);
        if (factory == null) {
            throw new Error("Can't find registered IEntityFactory for kind: " + nk.kind);
        }

        var res = factory.createEntity();
        var resa: any = res;

        var key: Key<TId> = this.native2key(nk);
        resa._key = key;

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

        return res as $T;
    }

    private static key2path(key: Key<TId>): any[] {
        var res: any[] = [];

        var k = key;
        while (k != null) {
            res.push(k.kind);
            res.push(k.id);
            k = key.parent;
        }

        return res;
    }

    private static entity2data(e: AEntity<TId>): {} {
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

    public static native2key(nk: entity.Key): Key<TId> {
        if (nk == null) {
            return null;
        }

        var parent: Key<TId> = null;
        if (nk.parent != null) {
            parent = this.native2key(nk.parent);
        }

        var id: TId;
        if (nk.id != null) {
            id = ds.int(nk.id);
        } else {
            id = nk.id;
        }

        return Key.createWithParent(nk.kind, id, parent, nk.namespace);
        
    }

    public static key2native<$IdType extends TId>(key: Key<$IdType>): entity.Key {
        var keyOptions: entity.KeyOptions = {path: this.key2path(key)};
        if (key.namespace != null) {
            keyOptions.namespace = key.namespace;
        }
        var res = new entity.Key(keyOptions);

        return res;
    }

    private constructor() {}

}