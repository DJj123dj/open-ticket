"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlashCommandMentionableOption = void 0;
require("discord-api-types/v9");
const CommandOptionBase_1 = require("../mixins/CommandOptionBase");
class SlashCommandMentionableOption extends CommandOptionBase_1.SlashCommandOptionBase {
    constructor() {
        super(9 /* Mentionable */);
        Object.defineProperty(this, "type", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 9 /* Mentionable */
        });
    }
}
exports.SlashCommandMentionableOption = SlashCommandMentionableOption;
//# sourceMappingURL=mentionable.js.map