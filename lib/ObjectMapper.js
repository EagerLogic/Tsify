"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DS = require("@google-cloud/datastore");
const NativeEntity_1 = require("./NativeEntity");
const entity_1 = require("@google-cloud/datastore/build/src/entity");
const Key_1 = require("./Key");
const Tsify_1 = require("./Tsify");
const ds = new DS.Datastore();
class ObjectMapper {
    static entity2native(e) {
        if (e == null) {
            throw new Error('The entity parameter can not be null');
        }
        var res = new NativeEntity_1.NativeEntity();
        var keyOptions = { path: this.key2path(e.key) };
        if (e.namespace != null) {
            keyOptions.namespace = e.namespace;
        }
        res.key = new entity_1.entity.Key(keyOptions);
        res.data = this.entity2data(e);
        res.excludeFromIndexes = e.excludeFromIndexes;
        return res;
    }
    static native2entity(data) {
        var nk = data[ds.KEY];
        var factory = Tsify_1.Tsify.getEntityFactoryByClassName(nk.kind);
        if (factory == null) {
            throw new Error("Can't find registered IEntityFactory for kind: " + nk.kind);
        }
        var res = factory.createEntity();
        var resa = res;
        var key = this.native2key(nk);
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
        return res;
    }
    static key2path(key) {
        var res = [];
        var k = key;
        while (k != null) {
            res.push(k.kind);
            res.push(k.id);
            k = key.parent;
        }
        return res;
    }
    static entity2data(e) {
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
            else if (v instanceof Key_1.Key) {
                res[p] = this.key2path(v);
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
            id = ds.int(nk.id);
        }
        else {
            id = nk.id;
        }
        return Key_1.Key.createWithParent(nk.kind, id, parent, nk.namespace);
    }
    static key2native(key) {
        var keyOptions = { path: this.key2path(key) };
        if (key.namespace != null) {
            keyOptions.namespace = key.namespace;
        }
        var res = new entity_1.entity.Key(keyOptions);
        return res;
    }
    constructor() { }
}
exports.ObjectMapper = ObjectMapper;
//# sourceMappingURL=ObjectMapper.js.map