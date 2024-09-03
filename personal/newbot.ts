import dotenv from 'dotenv';
dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN;
// *********************************************************************************************************************
import { Client, EmbedBuilder, GatewayIntentBits, TextChannel } from 'discord.js';
export const client = new Client({ intents: GatewayIntentBits.Guilds });

let serverActive = false;

console.log('Bot token: ' + BOT_TOKEN);
client.login(BOT_TOKEN);

client.on('ready', () => { 
    console.log(`Logged in as ${client.user!.tag}!`);
    client.user!.setActivity(serverActive ? "Server Online" : "Server Offline");
    checkMCServerStatus();
    setInterval(() => {
        checkMCServerStatus();
    }, interval);
});

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

    let onlineString = data.players.online > 0 ? `🟢 ${data.players.online} Online` : `🟢 Empty, Online`;
    let statusString = serverActive ? onlineString : "🔴 Server Offline";

    client.user!.setActivity(statusString);
    let botChannel = client.channels.cache.get(process.env.UPDATE_CHANNEL) as TextChannel;
    if (!botChannel) return console.error("Channel not found.");
    try {
        statusMessage = await botChannel.messages.fetch("1280571453926019164");
    } catch {
        botChannel.send("Server Status:");
        return;
    }
    
    let serverEmbed = new EmbedBuilder()
            .setTitle(`ATM9 Minecraft Server Status`)
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