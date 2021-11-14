"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlashCommandChannelOption = void 0;
require("discord-api-types/v9");
const CommandOptionBase_1 = require("../mixins/CommandOptionBase");
class SlashCommandChannelOption extends CommandOptionBase_1.SlashCommandOptionBase {
    constructor() {
        super(7 /* Channel */);
        Object.defineProperty(this, "type", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 7 /* Channel */
        });
    }
}
exports.SlashCommandChannelOption = SlashCommandChannelOption;
//# sourceMappingURL=channel.js.map