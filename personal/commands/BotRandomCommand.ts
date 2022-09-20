import { SlashCommandBuilder } from "discord.js";
import { BotSlashCommand } from "./BotSlashCommand.js";

export class BotRandomCommand extends BotSlashCommand {
    constructor() {
        super('random', 'Get a random number');
    }

    getSlashCommand() {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .addSubcommand(subcommand =>
                subcommand
                    .setName('integer')
                    .setDescription('Get a random integer')
                    .addIntegerOption(option =>
                        option
                            .setName('min')
                            .setDescription('The minimum value')
                            .setRequired(true))
                    .addIntegerOption(option =>
                        option
                            .setName('max')
                            .setDescription('The maximum value')
                            .setRequired(true)))
            .addSubcommand(subcommand =>
                subcommand
                    .setName('decimal')
                    .setDescription('Get a random decimal')
                    .addNumberOption(option =>
                        option
                            .setName('min')
                            .setDescription('The minimum value')
                            .setRequired(true))
                    .addNumberOption(option =>
                        option
                            .setName('max')
                            .setDescription('The maximum value')
                            .setRequired(true)))
            .addSubcommand(subcommand =>
                subcommand
                    .setName('boolean')
                    .setDescription('Get a random boolean'))
            .addSubcommand(subcommand =>
                subcommand
                    .setName('character')
                    .setDescription('Get a random character'))
            .addSubcommand(subcommand =>
                subcommand
                    .setName('string')
                    .setDescription('Get a random string')
                    .addIntegerOption(option =>
                        option
                            .setName('length')
                            .setDescription('The length of the string')
                            .setRequired(true)))
            .toJSON();
    }

    execute(interaction : any) {
        switch (interaction.options.getSubcommand()) {
            case 'Integer':
                const min = interaction.options.getInteger('min');
                const max = interaction.options.getInteger('max');
                interaction.reply(Math.floor(Math.random() * (max - min + 1)) + min);
                break;
            case 'Decimal':
                const min2 = interaction.options.getNumber('min');
                const max2 = interaction.options.getNumber('max');
                interaction.reply(Math.random() * (max2 - min2) + min2);
                break;
            case 'Boolean':
                interaction.reply(Math.random() < 0.5);
                break;
            case 'Character':
                interaction.reply(String.fromCharCode(Math.floor(Math.random() * 26) + 97));
                break;
            case 'String':
                const length = interaction.options.getInteger('length');
                let result = '';
                const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                const charactersLength = characters.length;
                for (let i = 0; i < length; i++) {
                    result += characters.charAt(Math.floor(Math.random() * charactersLength));
                }
                interaction.reply(result);
                break;
        }
    }
}