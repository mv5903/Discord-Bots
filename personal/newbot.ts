import dotenv from 'dotenv';
dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN;
const CLIENT_ID = '762752067856760852';
export const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
// *********************************************************************************************************************
import { EmbedBuilder, InteractionType, REST, Routes, TextChannel } from 'discord.js';
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
        //console.log("PERSONAL_BOT: Starting bot with / command prefix");
        //await rest.put(Routes.applicationGuildCommands(CLIENT_ID, '1213951678399914054'), { body:  COMMANDS.map(command => command.getSlashCommand()) });
        //console.log("PERSONAL_BOT: Successfully reloaded application / commands");
    } catch (error) {
        console.error(error);
    }
})();

// Command handler
import { Client, GatewayIntentBits } from 'discord.js';
import { BotSlashCommand } from './commands/BotSlashCommand.js';
export const client = new Client({ intents: GatewayIntentBits.Guilds });

let serverActive = false;

client.on('ready', () => { 
    console.log(`Logged in as ${client.user!.tag}!`)
    client.user!.setActivity(serverActive ? "Server online" : "Server offline");
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
console.log('bot token: ' + BOT_TOKEN);
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

const interval = 1000 * 5;

let statusMessage = null;

async function checkMCServerStatus() {
    const response = await fetch("https://api.mcsrvstat.us/3/home.mattvandenberg.com");
    if (!response.ok) {
        serverActive = false;
        return;
    }
    
    const data = await response.json();
    if (!data) {
        serverActive = false;
        return;
    }

    serverActive = data.online;
    client.user!.setActivity(serverActive ? "Server online" : "Server offline");
    let botChannel = client.channels.cache.get('1213951678399914054') as TextChannel;
    if (!botChannel) return console.error("Channel not found.");
    statusMessage = await botChannel.messages.fetch("1213960743771447347");
    
    let serverEmbed = new EmbedBuilder()
            .setTitle(`Mathias Minecraft Server Status`)
            .setColor(serverActive ? '#00ff00' : '#ff0000')
            .setDescription((serverActive ? 'Online' : 'Offline') + ` (Last checked: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()})`)
            .addFields(
                {name: 'IP: ', value: "home.mattvandenberg.com", inline: false},
                {name: 'MOTD: ', value: data.motd.clean[0], inline: false},
                {name: `${data.players.online}/${data.players.max} Players: `, value: (data.players.online > 0 && data.players.list.map(player => `-${player.name}`).join("\n")), inline: false},
                {name: 'Version: ', value: data.version, inline: false},
            );

    statusMessage.edit({embeds: [serverEmbed] });

}

setInterval(() => {
    checkMCServerStatus();
}, interval);