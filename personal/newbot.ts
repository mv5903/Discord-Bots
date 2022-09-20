const BOT_TOKEN = process.env.BOT_TOKEN;
const CLIENT_ID = '762752067856760852';
export const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
// *********************************************************************************************************************
import { InteractionType, REST, Routes } from 'discord.js';
import { BotTimeCommand, BotDateCommand, BotWeatherCommand, BotRandomCommand, BotUserPrefences, BotCurrencyCommand } from './commands/MattBotCommands.js';

// All the commands that the bot will have
const COMMANDS : BotSlashCommand[] = [
    new BotTimeCommand(),
    new BotDateCommand(),
    new BotWeatherCommand(),
    new BotRandomCommand(),
    new BotCurrencyCommand(),
    new BotUserPrefences(),
];

// Submit to Discord Slash Commands API
const rest = new REST({ version: '10' }).setToken(BOT_TOKEN);
( async () => {
    try {
        console.log("Starting bot with / command prefix");
        await rest.put(Routes.applicationGuildCommands(CLIENT_ID, '401786060704710667'), { body:  COMMANDS.map(command => command.getSlashCommand()) });
        console.log("Successfully reloaded application / commands");
    } catch (error) {
        console.error(error);
    }
})();

// Command handler
import { Client, GatewayIntentBits } from 'discord.js';
import { BotSlashCommand } from './commands/BotSlashCommand.js';
export const client = new Client({ intents: GatewayIntentBits.Guilds });

client.on('ready', () => { 
    console.log(`Logged in as ${client.user!.tag}!`)
});

client.on('interactionCreate', async (interaction) => {
    // For redirecting to the autocomplete handler
    if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
        COMMANDS.forEach(command => {
            if (command.name === interaction.commandName) {
                command.autocomplete(interaction);
            }
        })
    }
    if (!interaction.isChatInputCommand()) return;
    interaction.commandName = interaction.commandName.toLowerCase();
    COMMANDS.forEach(command => {
        if (command.name === interaction.commandName) {
            command.execute(interaction);
        }
    })
})

client.login(BOT_TOKEN);

/**
 * Checks to see if a user has a given role. Roles are often used for user preferences.
 * @param id ID of the role to check for
 * @param interaction The interaction initiated by the user
 * @returns User has the role
 */
export function hasRole(id: string, interaction: any) : boolean {
    try {
        const role = interaction.member.roles.cache.get(id);
        return role.name != null;
    } catch (error) {
        return false;
    }
}