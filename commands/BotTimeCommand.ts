import { CacheType, ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import moment from 'moment-timezone';
import { BotSlashCommand } from './BotSlashCommand.js';

export class BotTimeCommand extends BotSlashCommand {
    constructor() {
        super('time', 'Displays the current time (new)');
    }

    getSlashCommand() {
        return new SlashCommandBuilder()
        .setName(this.name)
        .setDescription(this.description)
        .addStringOption(option => 
            option.setName('timezone')
                .setDescription('The timezone to get the time in')
                .setRequired(true)
                .addChoices(
                    { name: 'America/New_York', value: 'America/New_York' },
                    { name: 'America/Chicago', value: 'America/Chicago' },
                    { name: 'America/Denver', value: 'America/Denver' },
                    { name: 'America/Los_Angeles', value: 'America/Los_Angeles' },
                    { name: 'America/Anchorage', value: 'America/Anchorage' },
                    { name: 'America/Costa_Rica', value: 'America/Costa_Rica' },
                    { name: 'America/Mexico_City', value: 'America/Mexico_City' },
                    { name: 'America/Cancun', value: 'America/Cancun' },
                    { name: 'Asia/Jerusalem', value: 'Asia/Jerusalem' },
                    { name: 'Asia/Tokyo', value: 'Asia/Tokyo' },
                    { name: 'Asia/Seoul', value: 'Asia/Seoul' },
                    { name: 'Asia/Shanghai', value: 'Asia/Shanghai' },
                    { name: 'Asia/Hong_Kong', value: 'Asia/Hong_Kong' },
                    { name: 'Asia/Manila', value: 'Asia/Manila' },
                    { name: 'Asia/Singapore', value: 'Asia/Singapore' },
                    { name: 'Europe/London', value: 'Europe/London' },
                    { name: 'Europe/Paris', value: 'Europe/Paris' },
                    { name: 'Europe/Berlin', value: 'Europe/Berlin' },
                    { name: 'Europe/Madrid', value: 'Europe/Madrid' },
                    { name: 'Europe/Rome', value: 'Europe/Rome' },
                    { name: 'Europe/Amsterdam', value: 'Europe/Amsterdam' },
                    { name: 'Europe/Athens', value: 'Europe/Athens' },
                    { name: 'Europe/Dublin', value: 'Europe/Dublin' },
                    { name: 'Europe/Helsinki', value: 'Europe/Helsinki' },
                    { name: 'Europe/Lisbon', value: 'Europe/Lisbon' },
                ))
        .toJSON()
    }

    execute(interaction: ChatInputCommandInteraction<CacheType>) {
        const timezone : string = interaction.options.getString('timezone');
        if (timezone) {
            const time = moment().tz(timezone).format('h:mm a');
            interaction.reply(`The time in ${timezone} is ${time}`);
        } else {
            const time = moment().format('h:mm:ss a');
            interaction.reply(`The time is ${time}`);
        }
    }
}