import { ApplicationCommandOptionType } from 'discord-api-types/v9';
import { ApplicationCommandOptionWithChoicesBase } from '../mixins/CommandOptionWithChoices';
export declare class SlashCommandIntegerOption extends ApplicationCommandOptionWithChoicesBase<number> {
    readonly type: ApplicationCommandOptionType.Integer;
    constructor();
}
//# sourceMappingURL=integer.d.ts.map