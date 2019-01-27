"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getEntityKind(entity) {
    return entity.constructor;
}
exports.getEntityKind = getEntityKind;
class Key {
    constructor(kind, id, parent, namespace) {
        if (kind == null) {
            throw new Error('The kind parameter is mandatory!');
        }
        this._kind = kind;
        if (id != null) {
            this._id = id;
        }
        if (parent != null) {
            this._parent = parent;
        }
        if (namespace != null) {
            this._namespace = namespace;
        }
    }
    static fromEntity(entity) {
        return new Key(getEntityKind(entity).name, entity.id, entity._parent, entity._namespace);
    }
    static createNew(cls, namespace) {
        return new Key(cls.name, null, null, namespace);
    }
    static createNewWithParent(cls, parent, namespace) {
        return new Key(cls.name, null, parent, namespace);
    }
    static create(cls, id, namespace) {
        return new Key(cls.name, id, null, namespace);
    }
    static createWithParent(cls, id, parent, namespace) {
        return new Key(cls.name, id, parent, namespace);
    }
    static createRaw(kind, id, parent, namespace) {
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