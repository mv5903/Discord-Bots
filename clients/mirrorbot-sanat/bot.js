const BOT_TOKEN = process.env.SANAT_BOT_TOKEN;
// INVITE URL : https://discord.com/oauth2/authorize?client_id=1012211506382901348&scope=bot+applications.commands

// Modify this code to match the id's of your text channels
const CHANNELS = [
    // Each group of id's. 
    {
        from: [
            // Agenda Channel
            '1013654828012011612',
            // Upcoming Releases Channel
            '987526183816134656'
        ],
        to: [
            '968659920176160851'
        ]
    },
    {
        from: [
            // Online Important Channel
            '987531165328093204'
        ],
        to: [
            '968659817226989579'
        ]
    },
    //TEST
    {
        from: [
            //A
            '1012404652123361362'
        ],
        to: [
            //F
            '1017258391644680202'
        ]
    }
]
import { Client, GatewayIntentBits } from 'discord.js';
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
client.on('ready', () => console.log(`SANAT_MIRROR_BOT: Logged in as ${client.user.tag}!`));

client.on('messageCreate', async message => {
    // Only respond to messages that are not from the bot
    if (message.author.bot) return;
    CHANNELS.forEach(channelSet => {
        if (channelSet.from.includes(message.channel.id)) {
            console.log('channelSet', channelSet);
            for (let channel of channelSet.to) {
                console.log('channel', channel);
                client.channels.cache.get(channel).send(`**${message.author.username}**: ${message.content}`);
            }
        }
    })
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
});

client.login(BOT_TOKEN);