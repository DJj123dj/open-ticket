"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlashCommandSubcommandBuilder = exports.SlashCommandSubcommandGroupBuilder = void 0;
const tslib_1 = require("tslib");
require("discord-api-types/v9");
const ts_mixer_1 = require("ts-mixer");
const Assertions_1 = require("./Assertions");
const CommandOptions_1 = require("./mixins/CommandOptions");
const NameAndDescription_1 = require("./mixins/NameAndDescription");
/**
 * Represents a folder for subcommands
 *
 * For more information, go to https://discord.com/developers/docs/interactions/slash-commands#subcommands-and-subcommand-groups
 */
let SlashCommandSubcommandGroupBuilder = class SlashCommandSubcommandGroupBuilder {
    constructor() {
        /**
         * The name of this subcommand group
         */
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: undefined
        });
        /**
         * The description of this subcommand group
         */
        Object.defineProperty(this, "description", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: undefined
        });
        /**
         * The subcommands part of this subcommand group
         */
        Object.defineProperty(this, "options", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
    }
    /**
     * Adds a new subcommand to this group
     * @param input A function that returns a subcommand builder, or an already built builder
     */
    addSubcommand(input) {
        const { options } = this;
        // First, assert options conditions - we cannot have more than 25 options
        Assertions_1.validateMaxOptionsLength(options);
        // Get the final result
        const result = typeof input === 'function' ? input(new SlashCommandSubcommandBuilder()) : input;
        Assertions_1.assertReturnOfBuilder(result, SlashCommandSubcommandBuilder);
        // Push it
        options.push(result);
        return this;
    }
    toJSON() {
        Assertions_1.validateRequiredParameters(this.name, this.description, this.options);
        return {
            type: 2 /* SubcommandGroup */,
            name: this.name,
            description: this.description,
            options: this.options.map((option) => option.toJSON()),
        };
    }
};
SlashCommandSubcommandGroupBuilder = tslib_1.__decorate([
    ts_mixer_1.mix(NameAndDescription_1.SharedNameAndDescription)
], SlashCommandSubcommandGroupBuilder);
exports.SlashCommandSubcommandGroupBuilder = SlashCommandSubcommandGroupBuilder;
/**
 * Represents a subcommand
 *
 * For more information, go to https://discord.com/developers/docs/interactions/slash-commands#subcommands-and-subcommand-groups
 */
let SlashCommandSubcommandBuilder = class SlashCommandSubcommandBuilder {
    constructor() {
        /**
         * The name of this subcommand
         */
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: undefined
        });
        /**
         * The description of this subcommand
         */
        Object.defineProperty(this, "description", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: undefined
        });
        /**
         * The options of this subcommand
         */
        Object.defineProperty(this, "options", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
    }
    toJSON() {
        Assertions_1.validateRequiredParameters(this.name, this.description, this.options);
        return {
            type: 1 /* Subcommand */,
            name: this.name,
            description: this.description,
            options: this.options.map((option) => option.toJSON()),
        };
    }
};
SlashCommandSubcommandBuilder = tslib_1.__decorate([
    ts_mixer_1.mix(NameAndDescription_1.SharedNameAndDescription, CommandOptions_1.SharedSlashCommandOptions)
], SlashCommandSubcommandBuilder);
exports.SlashCommandSubcommandBuilder = SlashCommandSubcommandBuilder;
//# sourceMappingURL=SlashCommandSubcommands.js.map