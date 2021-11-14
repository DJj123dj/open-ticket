"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlashCommandBooleanOption = void 0;
require("discord-api-types/v9");
const CommandOptionBase_1 = require("../mixins/CommandOptionBase");
class SlashCommandBooleanOption extends CommandOptionBase_1.SlashCommandOptionBase {
    constructor() {
        super(5 /* Boolean */);
        Object.defineProperty(this, "type", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 5 /* Boolean */
        });
    }
}
exports.SlashCommandBooleanOption = SlashCommandBooleanOption;
//# sourceMappingURL=boolean.js.map