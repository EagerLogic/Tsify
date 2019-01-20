"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Key {
    constructor(kind, id, parent, namespace) {
        if (kind == null) {
            throw new Error('The kind parameter is mandatory!');
        }
        kind = kind.trim();
        if (kind.length < 1) {
            throw new Error('The kind parameter can not be an empty string!');
        }
        this._kind = kind;
        this._id = id;
        this._parent = parent;
        this._namespace = namespace;
    }
    static fromEntity(entity) {
        return new Key(entity.kind, entity.id, entity.parent, entity.namespace);
    }
    static createNew(kind, namespace) {
        return new Key(kind, null, null, namespace);
    }
    static createNewWithParent(kind, parent, namespace) {
        return new Key(kind, null, parent, namespace);
    }
    static create(kind, id, namespace) {
        return new Key(kind, id, null, namespace);
    }
    static createWithParent(kind, id, parent, namespace) {
        return new Key(kind, id, parent, namespace);
    }
    get kind() {
        return this._kind;
    }
    get id() {
        return this._id;
    }
    get parent() {
        return this._parent;
    }
    get namespace() {
        return this._namespace;
    }
}
exports.Key = Key;
//# sourceMappingURL=Key.js.map