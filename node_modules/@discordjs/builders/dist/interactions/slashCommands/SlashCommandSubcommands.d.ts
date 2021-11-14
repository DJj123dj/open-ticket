import { ApplicationCommandOptionType } from 'discord-api-types/v9';
import { SharedSlashCommandOptions } from './mixins/CommandOptions';
import { SharedNameAndDescription } from './mixins/NameAndDescription';
import type { ToAPIApplicationCommandOptions } from './SlashCommandBuilder';
/**
 * Represents a folder for subcommands
 *
 * For more information, go to https://discord.com/developers/docs/interactions/slash-commands#subcommands-and-subcommand-groups
 */
export declare class SlashCommandSubcommandGroupBuilder implements ToAPIApplicationCommandOptions {
    /**
     * The name of this subcommand group
     */
    readonly name: string;
    /**
     * The description of this subcommand group
     */
    readonly description: string;
    /**
     * The subcommands part of this subcommand group
     */
    readonly options: ToAPIApplicationCommandOptions[];
    /**
     * Adds a new subcommand to this group
     * @param input A function that returns a subcommand builder, or an already built builder
     */
    addSubcommand(input: SlashCommandSubcommandBuilder | ((subcommandGroup: SlashCommandSubcommandBuilder) => SlashCommandSubcommandBuilder)): this;
    toJSON(): {
        type: ApplicationCommandOptionType;
        name: string;
        description: string;
        options: import("discord-api-types/v9").APIApplicationCommandOption[];
    };
}
export interface SlashCommandSubcommandGroupBuilder extends SharedNameAndDescription {
}
/**
 * Represents a subcommand
 *
 * For more information, go to https://discord.com/developers/docs/interactions/slash-commands#subcommands-and-subcommand-groups
 */
export declare class SlashCommandSubcommandBuilder implements ToAPIApplicationCommandOptions {
    /**
     * The name of this subcommand
     */
    readonly name: string;
    /**
     * The description of this subcommand
     */
    readonly description: string;
    /**
     * The options of this subcommand
     */
    readonly options: ToAPIApplicationCommandOptions[];
    toJSON(): {
        type: ApplicationCommandOptionType;
        name: string;
        description: string;
        options: import("discord-api-types/v9").APIApplicationCommandOption[];
    };
}
export interface SlashCommandSubcommandBuilder extends SharedNameAndDescription, SharedSlashCommandOptions<false> {
}
//# sourceMappingURL=SlashCommandSubcommands.d.ts.map