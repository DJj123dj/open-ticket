"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlashCommandStringOption = void 0;
require("discord-api-types/v9");
const CommandOptionWithChoices_1 = require("../mixins/CommandOptionWithChoices");
class SlashCommandStringOption extends CommandOptionWithChoices_1.ApplicationCommandOptionWithChoicesBase {
    constructor() {
        super(3 /* String */);
        Object.defineProperty(this, "type", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 3 /* String */
        });
    }
}
exports.SlashCommandStringOption = SlashCommandStringOption;
//# sourceMappingURL=string.js.map