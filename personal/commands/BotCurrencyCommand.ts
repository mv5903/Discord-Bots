import { SlashCommandBuilder } from "discord.js";
import { CODES } from "./assets/currencyCodes.js";
import { BotSlashCommand } from "./BotSlashCommand.js";
import fetch from "node-fetch";

export class BotCurrencyCommand extends BotSlashCommand {  
    constructor() {
        super('currency', 'convert currency');
    }

    getSlashCommand() {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .addStringOption(option =>
                option.setName('amount')
                    .setDescription('The amount to convert')
                    .setRequired(true))
            .addStringOption(option =>
                option.setName('from')
                    .setDescription('The currency to convert from')
                    .setRequired(true)
                    .setAutocomplete(true))
            .addStringOption(option =>
                option.setName('to')
                    .setDescription('The currency to convert to')
                    .setRequired(true)
                    .setAutocomplete(true))
            .toJSON()
    }

    execute(interaction : any) {
        const amount = interaction.options.getString('amount');
        const from = interaction.options.getString('from');
        const to = interaction.options.getString('to');

        fetch(`https://api.exchangerate.host/convert?from=${from}&to=${to}&amount=${amount}`)
            .then(response => response.json())
            .then((data : any) => {
                interaction.reply(`${parseFloat(amount).toFixed(2)} ${from} is ${data.result.toFixed(2)} ${to}, with a current exchange rate of approximately ${data.info.rate.toFixed(3)}.`);
            })
            .catch(error => {
                interaction.reply(error.message);
            }
        );
    }

    autocomplete(interaction : any) {
        const focusedValue = interaction.options.getFocused().toLowerCase();
            const filtered = CODES.filter(choice => {
                return choice.code.toLowerCase().includes(focusedValue) || choice.description.toLowerCase().includes(focusedValue)
            })
            if (filtered.length > 25) return;
            interaction.respond(filtered.map(choice => ({ name: choice.description + " (" + choice.code + ")", value: choice.code })))
                .catch(error => {
                    console.error(error)
                    return;
                }
            );
    }
}