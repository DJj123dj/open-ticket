"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlashCommandOptionBase = void 0;
const tslib_1 = require("tslib");
const ow_1 = tslib_1.__importDefault(require("ow"));
const Assertions_1 = require("../Assertions");
const NameAndDescription_1 = require("./NameAndDescription");
class SlashCommandOptionBase extends NameAndDescription_1.SharedNameAndDescription {
    constructor(type) {
        super();
        Object.defineProperty(this, "required", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "type", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.type = type;
    }
    /**
     * Marks the option as required
     * @param required If this option should be required
     */
    setRequired(required) {
        // Assert that you actually passed a boolean
        ow_1.default(required, 'required', ow_1.default.boolean);
        this.required = required;
        return this;
    }
    toJSON() {
        Assertions_1.validateRequiredParameters(this.name, this.description, []);
        // Assert that you actually passed a boolean
        ow_1.default(this.required, 'required', ow_1.default.boolean);
        return {
            type: this.type,
            name: this.name,
            description: this.description,
            required: this.required,
        };
    }
}
exports.SlashCommandOptionBase = SlashCommandOptionBase;
//# sourceMappingURL=CommandOptionBase.js.map