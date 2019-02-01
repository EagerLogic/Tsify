"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DS = require("@google-cloud/datastore");
const NativeEntity_1 = require("./NativeEntity");
const entity_1 = require("@google-cloud/datastore/build/src/entity");
const Key_1 = require("./Key");
const Tsify_1 = require("./Tsify");
const IEntity_1 = require("./IEntity");
const ds = new DS.Datastore();
class ObjectMapper {
    static entity2native(e) {
        if (e == null) {
            throw new Error('The entity parameter can not be null');
        }
        var kind = Key_1.getEntityKind(e).name;
        var factory = Tsify_1.Tsify.getEntityFactoryByClassName(kind);
        if (factory == null) {
            throw new Error("Can't find registered IEntityFactory for kind: " + kind);
        }
        var res = new NativeEntity_1.NativeEntity();
        var key = Key_1.Key.fromEntity(e);
        var keyOptions = { path: this.key2path(key) };
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
    static native2entity(data) {
        var nk = data[ds.KEY];
        var factory = Tsify_1.Tsify.getEntityFactoryByClassName(nk.kind);
        if (factory == null) {
            throw new Error("Can't find registered IEntityFactory for kind: " + nk.kind);
        }
        var res = factory.createEntity();
        var key = this.native2key(nk);
        if (key.id != null) {
            res.id = key.id;
        }
        else {
            res.id = null;
        }
        if (key.namespace != null) {
            res._namespace = key.namespace;
        }
        else {
            delete res._namespace;
        }
        if (key.parent != null) {
            res._parent = key.parent;
        }
        else {
            delete res._parent;
        }
        var resa = res;
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
            if (ds.isInt(v)) {
                resa[p] = new IEntity_1.LongId(v.value);
            }
            else {
                resa[p] = data[p];
            }
        }
        return res;
    }
    static key2path(key) {
        var res = [];
        var ns = key.namespace;
        var k = key;
        while (k != null) {
            if (k.namespace != ns) {
                throw new Error('The parent entity must be in the same namespace as the entity itself!');
            }
            res.push(k.kind);
            if (k.id != null) {
                if (k.id instanceof IEntity_1.LongId) {
                    res.push(new entity_1.entity.Int(k.id.value));
                }
                else if ((typeof k.id) == 'string') {
                    res.push(k.id);
                }
                else {
                    throw new Error('Invalid id type: ' + k.id);
                }
            }
            k = key.parent;
        }
        return res;
    }
    static entity2data(e) {
        var res = {};
        var exclude = ['id', '_namespace', '_parent', '_excludeFromIndexes'];
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
            t;
            if (t == 'function' || t == 'symbol') {
                continue;
            }
            if (t == 'number') {
                if (v % 1 == 0) {
                    res[p] = ds.int(v);
                }
                else {
                    res[p] = ds.double(v);
                }
            }
            else if (v instanceof IEntity_1.LongId) {
                res[p] = ds.int(v.value);
            }
            else {
                res[p] = v;
            }
        }
        return res;
    }
    static native2key(nk) {
        if (nk == null) {
            return null;
        }
        var parent = null;
        if (nk.parent != null) {
            parent = this.native2key(nk.parent);
        }
        var id;
        if (nk.id != null) {
            id = new IEntity_1.LongId(nk.id);
        }
        else {
            id = nk.name;
        }
        return Key_1.Key.createRaw(nk.kind, id, parent, nk.namespace);
    }
    static key2native(key) {
        var keyOptions = { path: this.key2path(key) };
        if (key.namespace != null) {
            keyOptions.namespace = key.namespace;
        }
        var res = ds.key(keyOptions);
        return res;
    }
    constructor() { }
}
exports.ObjectMapper = ObjectMapper;
//# sourceMappingURL=ObjectMapper.js.map