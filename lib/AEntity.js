"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Key_1 = require("./Key");
class AEntity {
    constructor(namespace, id, parent, excludeFromIndexes) {
        this._excludeFromIndexes = [];
        this._key = Key_1.Key.createWithParent(this.kind, id, parent, namespace);
        this.parent = parent;
        if (excludeFromIndexes == null) {
            excludeFromIndexes = [];
        }
        this._excludeFromIndexes = excludeFromIndexes;
    }
    get kind() {
        return this.constructor.toString().match(/\w+/g)[1];
    }
    get id() {
        return this._key.id;
    }
    set id(id) {
        this._key = Key_1.Key.createWithParent(this.kind, id, this.parent, this.namespace);
    }
    get parent() {
        return this._key.parent;
    }
    set parent(parent) {
        this._key = Key_1.Key.createWithParent(this.kind, this.id, parent, this.namespace);
    }
    get excludeFromIndexes() {
        return this._excludeFromIndexes.filter(() => { return true; });
    }
    get key() {
        return Key_1.Key.fromEntity(this);
    }
    get namespace() {
        return this._key.namespace;
    }
}
exports.AEntity = AEntity;
//# sourceMappingURL=AEntity.js.map