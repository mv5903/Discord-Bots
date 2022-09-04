import { SlashCommandBuilder } from "discord.js";
import { BotSlashCommand } from "./BotSlashCommand.js";
import { client } from "../newbot.js";

export class BotUserPrefences extends BotSlashCommand {
    constructor() {
        super('userpreferences', 'Change your user preferences');
    }

    getSlashCommand() {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .addSubcommand(subcommand =>
                subcommand
                    .setName('temperaturepreference')
                    .setDescription('Set your temperature preference')
                    .addStringOption(option =>
                        option
                            .setName('system')
                            .setDescription('The temperature system to use')
                            .setRequired(true)
                            .addChoices(
                                { name: 'Celsius', value: 'celsius' },
                                { name: 'Fahrenheit', value: 'fahrenheit' },
                            )))
            .toJSON();

    }

    execute(interaction: any) {
        const system = interaction.options.getString('system');
        const guild = client.guilds.cache.get('401786060704710667');
        const member = guild.members.cache.get(interaction.user.id);
        guild.roles.fetch('1016088172314243112')
            .then(role => {
                if (system === 'celsius') {
                    member.roles.add(role);
                } else {
                    member.roles.remove(role);
                }
                interaction.reply(`Your temperature preference has been set to ${system}.`);
            })
            .catch(error => {
                interaction.reply(`There was an error setting your temperature preference to ${system}.`);
            })
    }
}