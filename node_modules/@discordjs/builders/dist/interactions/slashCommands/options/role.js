"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlashCommandRoleOption = void 0;
require("discord-api-types/v9");
const CommandOptionBase_1 = require("../mixins/CommandOptionBase");
class SlashCommandRoleOption extends CommandOptionBase_1.SlashCommandOptionBase {
    constructor() {
        super(8 /* Role */);
        Object.defineProperty(this, "type", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 8 /* Role */
        });
    }
}
exports.SlashCommandRoleOption = SlashCommandRoleOption;
//# sourceMappingURL=role.js.map