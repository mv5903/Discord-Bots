import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { BotSlashCommand } from "./BotSlashCommand.js";
import { WEATHER_API_KEY } from "../newbot.js";
import { hasRole } from "../newbot.js";
import fetch from "node-fetch";

export class BotWeatherCommand extends BotSlashCommand {
    constructor() {
        super('weather', 'Get the current weather');
    }

    getSlashCommand() {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .addStringOption(option =>
                option.setName('zipcode')
                    .setDescription('The zipcode to get the weather for')
                    .setRequired(true)).toJSON()
    }

    execute(interaction : any) {
        const zipcode = interaction.options.getString('zipcode');
        if (zipcode.length !== 5) {
            interaction.reply('Invalid Zipcode');
        }
        try {
            let prefersCelcius = hasRole('1016088172314243112', interaction);
            fetch('http://api.openweathermap.org/data/2.5/weather?zip=' + zipcode + ',us&appid=' + WEATHER_API_KEY + '&units=' + (prefersCelcius ? 'metric' : 'imperial')).then(
                response => response.json())
                .then((data : any) => {
                    const unit = prefersCelcius ? '°C' : '°F';
                    const weatherEmbed = new EmbedBuilder()
                        .setTitle(`Weather for ${data.name}`)
                        .setColor('#001aff')
                        .setDescription(`The weather in ${data.name} is ${data.weather[0].description} and ${data.main.temp} degrees.`)
                        .setThumbnail("http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png")
                        .addFields(
                            {name: 'Description: ', value: data.weather[0].main, inline: true},
                            {name: 'Feels Like: ', value: data.main.feels_like + unit},
                            {name: 'Temperature: ', value: (data.main.temp).toFixed(1) + unit},
                            {name: 'Today\'s High: ', value: (data.main.temp_max).toFixed(1) + unit},
                            {name: 'Today\'s Low: ', value: (data.main.temp_min).toFixed(1) + unit},
                            {name: 'Wind: ', value: data.wind.speed + ' mph at ' + data.wind.deg + '°'},
                            {name: 'Humidity: ', value: data.main.humidity + '%'},
                        );
                        interaction.reply({ embeds: [weatherEmbed] });
                }
            );
        } catch (error) {
            interaction.reply(error.message);
        }
    }
}