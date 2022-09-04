import { ChatInputCommandInteraction, CacheType } from "discord.js";
import moment from "moment";
import { BotSlashCommand } from "./BotSlashCommand.js";

export class BotDateCommand extends BotSlashCommand {
    constructor() {
        super('date', 'Get the current date');
    }

    getSlashCommand() {
        return {
            name: this.name,
            description: this.description,
        }
    }

    execute(interaction: ChatInputCommandInteraction<CacheType>) {
        const date = moment().format('MM-DD-YYYY');
        interaction.reply(`The date is ${date}`);
    }
}