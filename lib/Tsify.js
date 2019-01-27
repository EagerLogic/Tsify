"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Key_1 = require("./Key");
const DS = require("@google-cloud/datastore");
const ObjectMapper_1 = require("./ObjectMapper");
const ds = new DS.Datastore();
class Tsify {
    static registerEntity(cls, factory) {
        if (cls == null) {
            throw new Error('The cls parameter can not be null!');
        }
        if (cls.name == null) {
            throw new Error('The given cls parameter is not a class!');
        }
        if (factory == null) {
            throw new Error('The factory parameter can not be null!');
        }
        this.entityFactories[cls.name] = factory;
    }
    static getEntityFactoryByClass(cls) {
        return this.getEntityFactoryByClassName(cls.name);
    }
    static getEntityFactoryByClassName(clsName) {
        return this.entityFactories[clsName];
    }
    static save(entity) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            var nEntity = ObjectMapper_1.ObjectMapper.entity2native(entity);
            var res = new Promise((resolve, reject) => {
                ds.save(nEntity, (err) => {
                    if (err != null) {
                        reject(err);
                        return;
                    }
                    if (nEntity.key.id != null) {
                        entity.id = nEntity.key.id;
                    }
                    else {
                        entity.id = nEntity.key.name;
                    }
                    resolve(Key_1.Key.fromEntity(entity));
                });
            });
            return res;
        });
    }
    static saveEntities(entities) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            var nEntities = [];
            for (var e of entities) {
                nEntities.push(ObjectMapper_1.ObjectMapper.entity2native(e));
            }
            var res = new Promise((resolve, reject) => {
                ds.save(nEntities, (err) => {
                    if (err != null) {
                        reject(err);
                        return;
                    }
                    var res = [];
                    for (var i = 0; i < nEntities.length; i++) {
                        var nEntity = nEntities[i];
                        if (nEntity.key.id != null) {
                            entities[i].id = nEntity.key.id;
                        }
                        else {
                            entities[i].id = nEntity.key.name;
                        }
                        res.push(Key_1.Key.fromEntity(entities[i]));
                    }
                    resolve(res);
                });
            });
            return res;
        });
    }
    static findByKey(key) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                try {
                    var k = ObjectMapper_1.ObjectMapper.key2native(key);
                    var nres = yield ds.get(ObjectMapper_1.ObjectMapper.key2native(key));
                    console.log(nres);
                    if (nres == null) {
                        resolve(null);
                    }
                    if (nres.length < 1) {
                        resolve(null);
                    }
                    if (nres[0] == null) {
                        resolve(null);
                    }
                    resolve(ObjectMapper_1.ObjectMapper.native2entity(nres[0]));
                }
                catch (e) {
                    reject(e);
                }
            }));
        });
    }
    static deleteByKey(key) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                ds.delete(ObjectMapper_1.ObjectMapper.key2native(key), (err) => {
                    if (err != null) {
                        reject(err);
                    }
                    resolve();
                });
            });
        });
    }
    static deleteByKeys(keys) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                var nkeys = [];
                for (var k of keys) {
                    nkeys.push(ObjectMapper_1.ObjectMapper.key2native(k));
                }
                ds.delete(nkeys, (err) => {
                    if (err != null) {
                        reject(err);
                    }
                    resolve();
                });
            });
        });
    }
    static find(cls, namespace) {
        return new Finder(cls, namespace);
    }
}
Tsify.entityFactories = {};
exports.Tsify = Tsify;
class Finder {
    constructor(cls, namespace) {
        this.filters = [];
        this.orders = [];
        this.anchestorKey = null;
        this.limitCount = null;
        this.offsetCount = null;
        this.cls = cls;
        this.namespace = namespace;
    }
    anchestor(anchestorKey) {
        this.anchestorKey = anchestorKey;
        return this;
    }
    filter(property, operator, value) {
        this.filters.push({ property: property, operator: operator, value: value });
        return this;
    }
    orderBy(property, descending) {
        this.orders.push({ property: property, descending: descending });
        return this;
    }
    limit(count) {
        if (count == null) {
            this.limitCount = null;
        }
        count = count | 0;
        if (count < 1) {
            this.limitCount = null;
        }
        this.limitCount = count;
        return this;
    }
    offset(count) {
        if (count == null) {
            this.offsetCount = null;
        }
        count = count | 0;
        if (count < 1) {
            this.offsetCount = null;
        }
        this.offsetCount = count;
        return this;
    }
    run() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                var q = this.buildQuery();
                try {
                    var [nres] = yield ds.runQuery(q);
                    var res = [];
                    for (var nr of nres) {
                        res.push(ObjectMapper_1.ObjectMapper.native2entity(nr));
                    }
                    resolve(res);
                }
                catch (e) {
                    reject(e);
                }
            }));
        });
    }
    runKeysOnly() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                var q = this.buildQuery();
                q = q.select("__key__");
                try {
                    var [nres] = yield ds.runQuery(q);
                    var nkeys = nres.map((v) => v[ds.KEY]);
                    var res = [];
                    for (var nr of nkeys) {
                        res.push(ObjectMapper_1.ObjectMapper.native2key(nr));
                    }
                    resolve(res);
                }
                catch (e) {
                    reject(e);
                }
            }));
        });
    }
    buildQuery() {
        var q;
        if (this.namespace != null) {
            if (this.cls != null) {
                q = ds.createQuery(this.namespace, this.cls.name);
            }
            else {
                q = ds.createQuery(this.namespace, null);
            }
        }
        else {
            if (this.cls != null) {
                q = ds.createQuery(this.cls.name);
            }
            else {
                q = ds.createQuery(null, null);
            }
        }
        if (this.anchestorKey != null) {
            q = q.hasAncestor(ObjectMapper_1.ObjectMapper.key2native(this.anchestorKey));
        }
        for (var f of this.filters) {
            q = q.filter(f.property, f.operator, f.value);
        }
        for (var o of this.orders) {
            q = q.order(o.property, { descending: o.descending });
        }
        if (this.limitCount != null) {
            q = q.limit(this.limitCount);
        }
        if (this.offsetCount != null) {
            q.offset(this.offsetCount);
        }
        return q;
    }
}
exports.Finder = Finder;
//# sourceMappingURL=Tsify.js.map