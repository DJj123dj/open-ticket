"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharedNameAndDescription = void 0;
const Assertions_1 = require("../Assertions");
class SharedNameAndDescription {
    constructor() {
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "description", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
    /**
     * Sets the name
     * @param name The name
     */
    setName(name) {
        // Assert the name matches the conditions
        Assertions_1.validateName(name);
        Reflect.set(this, 'name', name);
        return this;
    }
    /**
     * Sets the description
     * @param description The description
     */
    setDescription(description) {
        // Assert the description matches the conditions
        Assertions_1.validateDescription(description);
        Reflect.set(this, 'description', description);
        return this;
    }
}
exports.SharedNameAndDescription = SharedNameAndDescription;
//# sourceMappingURL=NameAndDescription.js.map