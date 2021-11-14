import type { ApplicationCommandOptionType } from 'discord-api-types/v9';
import type { ToAPIApplicationCommandOptions } from '../SlashCommandBuilder';
import { SharedNameAndDescription } from './NameAndDescription';
export declare class SlashCommandOptionBase extends SharedNameAndDescription implements ToAPIApplicationCommandOptions {
    required: boolean;
    readonly type: ApplicationCommandOptionType;
    constructor(type: ApplicationCommandOptionType);
    /**
     * Marks the option as required
     * @param required If this option should be required
     */
    setRequired(required: boolean): this;
    toJSON(): {
        type: ApplicationCommandOptionType;
        name: string;
        description: string;
        required: boolean;
    };
}
//# sourceMappingURL=CommandOptionBase.d.ts.map