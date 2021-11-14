"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlashCommandIntegerOption = void 0;
require("discord-api-types/v9");
const CommandOptionWithChoices_1 = require("../mixins/CommandOptionWithChoices");
class SlashCommandIntegerOption extends CommandOptionWithChoices_1.ApplicationCommandOptionWithChoicesBase {
    constructor() {
        super(4 /* Integer */);
        Object.defineProperty(this, "type", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 4 /* Integer */
        });
    }
}
exports.SlashCommandIntegerOption = SlashCommandIntegerOption;
//# sourceMappingURL=integer.js.map