"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlashCommandUserOption = void 0;
require("discord-api-types/v9");
const CommandOptionBase_1 = require("../mixins/CommandOptionBase");
class SlashCommandUserOption extends CommandOptionBase_1.SlashCommandOptionBase {
    constructor() {
        super(6 /* User */);
        Object.defineProperty(this, "type", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 6 /* User */
        });
    }
}
exports.SlashCommandUserOption = SlashCommandUserOption;
//# sourceMappingURL=user.js.map