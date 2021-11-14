import { APIApplicationCommandOptionChoice, ApplicationCommandOptionType } from 'discord-api-types/v9';
import type { ToAPIApplicationCommandOptions } from '../SlashCommandBuilder';
import { SlashCommandOptionBase } from './CommandOptionBase';
export declare abstract class ApplicationCommandOptionWithChoicesBase<T extends string | number> extends SlashCommandOptionBase implements ToAPIApplicationCommandOptions {
    choices?: APIApplicationCommandOptionChoice[];
    /**
     * Adds a choice for this option
     * @param name The name of the choice
     * @param value The value of the choice
     */
    addChoice(name: string, value: T): this;
    /**
     * Adds multiple choices for this option
     * @param choices The choices to add
     */
    addChoices(choices: [name: string, value: T][]): this;
    toJSON(): {
        choices: APIApplicationCommandOptionChoice[] | undefined;
        type: ApplicationCommandOptionType;
        name: string;
        description: string;
        required: boolean;
    };
}
//# sourceMappingURL=CommandOptionWithChoices.d.ts.map