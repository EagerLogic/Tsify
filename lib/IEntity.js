"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Long {
    constructor(value) {
        if (value == null) {
            throw new Error('The value parameter can not be null!');
        }
        this._value = value;
    }
    get value() {
        return this._value;
    }
}
exports.Long = Long;
//# sourceMappingURL=IEntity.js.map