const Discord = require('discord.js');
const weather = require('openweather-apis');
const fetch = require('node-fetch');
const client = new Discord.Client();
const cron = require('cron');

const prefix = '-';
const createVoiceChannelID = '806345597161308170';
const infoChannelID = '548579154824527892';
const botChannelID = '762754228464517171';
const privateChannelCategoryID = '806506130737463309';
const dailyUpdateChannelID = '807718470787399730';
const herokuOffset = 5;
// Bot login
client.login(process.env.BOT_TOKEN);

// Initial connect to Discord
client.once('ready', () => {
	console.log('Discord bot is online!');
	scheduleJobs();
	client.user.setActivity("-help for commands!"); 
});

// Member joins the server
client.on('guildMemberAdd', member => {
    member.guild.channels.cache.get(infoChannelID).send('**' + member.user.username + '** has joined the server! :slight_smile: ');
    var role = member.guild.roles.cache.find(role => role.name === "People");
	member.roles.add(role); 
});


// Member leaves the server
client.on('guildMemberRemove', member => {
    member.guild.channels.cache.get(infoChannelID).send('**' + member.user.username + '** has left the server! :sob: ');
});


// Member joins or leaves a voice channel
client.on('voiceStateUpdate', (oldMember, newMember) => {
	let voiceChannels = newMember.guild.channels.cache.forEach((channel) => {
		if (channel.parentID === privateChannelCategoryID) {
			if (channel.members.size == 0) {
				channel.delete();
			}
		}
	})
	let newChannel = newMember.channelID;
	if (newChannel === createVoiceChannelID) {
		console.log('A private channel for ' + client.users.cache.get(newMember.id).username + ' has been created.');
		newMember.guild.channels.create(client.users.cache.get(newMember.id).username + '\'s vc (' + newMember.id + ')', {
			type: 'voice',
			parent: privateChannelCategoryID,
			permissionOverwrites: [
				{
					id: newMember.guild.id,
					deny: ['CONNECT', 'VIEW_CHANNEL'],
				},
				{
					id: newMember.id,
					allow: ['CONNECT', 'VIEW_CHANNEL'],
				},
			],
		})
		.then((channel) => {
			channel.setUserLimit(10);
			newMember.setChannel(channel);
		})
	}
});

// Member sends a message that contains the current prefix (-)
client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;
	const args = message.content.slice(prefix.length).split(" ");
	const command = args.shift().toLowerCase();
	var base = "";
	//Commands that can receive additional arguments
	if (command.includes('random') || command.includes('currency') || command.includes('stock') || command.includes('sb')) {
		base = command;
	} 
  	if (command.includes('allow')) {
  		let emoji = allowIntoVC(message, true) ? '✔️' : '❌'; 
  		message.react(emoji);
  		if (emoji === '❌') send("You are not the owner of any channel.");
  		return;
  	}
  	if (command.includes('remove')) {
  		let emoji = allowIntoVC(message, false) ? '✔️' : '❌'; 
  		message.react(emoji);
  		if (emoji === '❌') send("You are not the owner of any channel.");
  		return;
  	}
  	if (command.includes('rename')) {
  		//renameChannel(message);
  		return;
  	}
  	if (command.includes('weather')) {
  		getWeather(command.substring(7), message);
  		return;
  	}
	if (command.includes('movie')) {
		getMovieData(message);
		return;
	}
  	//Commands executable only by admins
  	adminRole = '806256817851072552';
    if (message.member.roles.cache.has(adminRole)) {
    	switch (command) {
			case 'm':
    			mute(message, true);
    			break;
			case 'u':
    			mute(message, false);
    			break;
    	}
    }
	switch (command) {
		case base:
			sendMessage(base);
			break;
		case 'omgreset':
			client.channels.cache.get('846383787532484653').name = 'OMG: 1';
			break;
		case 'omg':
			let name = client.channels.cache.get('846383787532484653').name.toString();
			let newName = 'OMG: ' + ((parseInt(name.substring(5))) + 1).toString();
			console.log(parseInt(name.substring(5)));
			client.channels.cache.get('846383787532484653').edit({name: newName}).then(updated => console.log('Changed')).catch(console.error);
	    	break;
	    case 'help':
	    	sendMessage("help");  
	    	break;
	    case 'date':
	    	sendMessage("date");
	    	break;
	    case 'time':
	    	sendMessage("time");
	    	break;
	    case 'info':
	    	sendMessage("info");
	    	break;
	    case 'website':
	    	send("View Matthew Vandeneberg's website at http://" + process.env.WEBSITE);
	    	break;
	    case 'random':
	    	sendMessage("random");
	    	break;
	    case 'uptime':
	    	sendMessage("uptime");
	    	break;
	    case 'how':
	    	send("This bot was created by <@401505856870678529> using the Discord.js module in the JavaScript programming language. Want more commands? Please dm <@401505856870678529>, he's always looking for suggestions.");
	    	break;
	    case 'minecraft':
	    	sendMessage("status");
	    	break;
	    case 'currency':
	    	sendMessage("currency");
	    	break;
	    case 'stock':
	    	sendMessage("stock");
			break;
		case 'subscribe':
			let theRole = message.guild.roles.cache.find(role => role.name === 'Daily Update Sub');
			message.guild.members.cache.get(message.author.id).roles.add(theRole);
			send('<@' + message.author.id + '>, you have successfully been subscribed to <#' + dailyUpdateChannelID + '>. Look out for updates at 8am, 1pm, and 5pm daily!');
			break;
		case 'unsubscribe':
			let thatRole = message.guild.roles.cache.find(role => role.name === 'Daily Update Sub');
			try {
				message.guild.members.cache.get(message.author.id).roles.remove(thatRole);
				send('<@' + message.author.id + '>, you have successfully been unsubscribed from <#' + dailyUpdateChannelID + '>. You will no longer receive updates.');
			} catch (e) {
				console.error(e);
			}
			break;
	    default:
	    	sendMessage("invalid");
	}
});

// Sends message to the bot channel.
function send(toSend) {
	channel = client.channels.cache.get(process.env.BOT_CHANNEL);
    channel.send(toSend);
}

// Will call the respective function based on the entered command.
function sendMessage(msg) {
	var toSend;
	if (msg === "help") {
		const helpEmbed = new Discord.MessageEmbed()
		.setColor('001aff')
		.setTitle('Help')
		.setDescription('Hi! I am matt\'s Discord bot! Here is the list of commands that I can do: ')
		.addFields(
			{name: '-allow', value: 'Allow someone into your private voice channel. Usage: -allow @name'},
			{name: '-currency', value: 'Get current currency exchange information, formatted as \"-currency[from code][to code][price]\", example: \"-currencyUSDCAD10.68\" Use -currencycodes for a list of codes.'},
			{name: '-date', value: 'Displays the current date.'},
			{name: '-help', value: 'Open this help message again.'},
			{name: '-how', value: 'How was this bot created?'},
			{name: '-info', value: 'Displays information about the Kwikmatt Server.'},
			{name: '-m', value: 'Mute all in a voice channel (Admins only).'},
			{name: '-minecraft', value: 'Displays the kwikmatt server ip if you are a part of the minecraft server.'},
			{name: '-movie', value: 'Display Movie Information. Usage: -movie[title]'},
			{name: '-time', value: 'Displays the current time.'},
			{name: '-random', value: 'Generate a random number using the following scheme: \"-random(min,max)int\". Use \"int\" for integer, or \"double\" for decimal number.'},
			{name: '-remove', value: 'Remove someone from your private voice channel. Usage: -remove @name'},
			{name: '-subscribe', value: 'Subscribe to view the weather and news updates delivered in the morning, afternoon, and evening to <#' + dailyUpdateChannelID + '>.'},
			{name: '-rename', value: 'Rename a channel in the server. Note: you need to be a part of los hombres to do this. Usage: -rename[original channel]:[new name] without the brackets.'},
			{name: '-stock', value: 'Gets stock info for a given symbol. Use -stockinfo to get the info you want; be sure to follow the format -stock[symbol]:[info] without the brackets.'},
			{name: '-u', value: 'Unmute all in a voice channel (Admins only).'},
			{name: '-unsubscribe', value: 'Use this command if you no long want to view the daily updates from <#' + dailyUpdateChannelID + '>.'},
			{name: '-uptime', value: 'Gets my uptime.'},
			{name: '-weather', value: 'Get weather for any zip code, for example, \"-weather10001\" will show the weather for New York City.'},
			{name: '-website', value: 'View Matthew Vandenberg\'s website.'},
		);
		send(helpEmbed);
	} else if (msg.includes("weather")) {
		if (msg.length != 12) {
			send("Please check your formatting and try typing that again.");
			return;
		}
		var zip = msg.substring(7);
		getWeather(zip, msg);
		return;
	} else if (msg === "date") {
		var usaTime = new Date().toLocaleString("en-US", {timeZone: "America/New_York"});
		var today = new Date(usaTime);
		var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
		var dayOfWeek = weekday[today.getDay()];
		toSend = "Today is " + dayOfWeek + ", " + (today.getMonth()+1) + "-" + today.getDate() + "-" + today.getFullYear() + "."
	} else if (msg === "time") {
		var easternTime = new Date().toLocaleString("en-US", {timeZone: "America/New_York"});
		var pacificTime = new Date().toLocaleString("en-US", {timeZone: "America/Los_Angeles"});
		var easternConverted = formatAMPM(new Date(easternTime));
		var pacificConverted = formatAMPM(new Date(pacificTime));
		toSend = "It is " + easternConverted + " ET/" + pacificConverted + " PT.";
	} else if (msg === "info") {
		toSend = "Welcome to the kwikmatt Server. In this server, we talk and play many different games! If you have any questions, please contact <@401505856870678529>.";
	} else if (msg === "invalid") {
		toSend = "Sorry, you either do not have permission to use this command or it does not exist.";
	} else if (msg.includes('random')) {
		toSend = getRandom(msg);
	} else if (msg === "uptime") {
		var uptime = process.uptime();
		var time = convertSeconds(uptime);
		toSend = 'I have been waiting for your commands for ' + time + "!";
	} else if (msg === "status") {
		mc();
	} else if (msg.includes('currency')) {
		currency(msg);
	} else if (msg.includes('stock')) {
		if (msg === 'stockinfo') {
			stockInfo();
		} else {
			getStock(msg);
			return;
		}
	} else if (msg.includes('soundboard')) {
		soundboard(msg);
	}
	send(toSend);
}

// Ensures that the person that requested the ability to join a voice channel is in fact the owner of the channel, then adds a permission
// to their voice channel so that the person that they @mention in the message can connect to that voice channel.
function allowIntoVC(message, isAdding) {
	let success = false;
	try {
		let voiceChannels = message.guild.channels.cache.forEach((channel) => {
			let channelOwnerID = channel.name;
			if (message.author.id == channelOwnerID.substring(channelOwnerID.indexOf("(") + 1, channelOwnerID.indexOf(")"))) {
				if (channel.members.size == 0) {
					send("This channel is not currently active. Please create one and then try this command again.");
					return;
				}
				let currentPerms = channel.permissionOverwrites;
				let perms = [];
				if (isAdding) {
					currentPerms.forEach((permission) => {
						perms.push(permission);
					})
					perms.push({id: message.mentions.users.first().id, allow: ['CONNECT', 'VIEW_CHANNEL']});
					let channelName = channel.name;
					channelName = channelName.substring(0, channelName.indexOf('('));
					send('<@' + message.mentions.users.first().id + '>, <@' + message.author.id + '> has allowed you into their voice channel. Please join ' + channelName + '.')
				} else {
					currentPerms.forEach((permission) => {
						if (permission.id != message.mentions.users.first().id) {
							perms.push(permission);
						}
					})
					let person = message.mentions.users.first().id;
					message.guild.member(person).voice.setChannel(null);
				}
				channel.overwritePermissions(perms);
				success = true;
			}
		})
		return success;
	} catch (e) {
		send("Something went wrong. Check your input and try again.");
		console.error(e);
	}
}

// Renames any channel that is not a reserved channel (such as info, bot, etc. because they are bot sensitive).
function renameChannel(message) {
	let original = message.content.substring(7, message.content.indexOf(":"));
	let newName = message.content.substring(message.content.indexOf(":") + 1);
	if (newName.length > 15) {
		send("The new channel name you chose exceeds the 15 character limit. Please choose another name.");
		return;
	}
	let bannedList = ['announcements', 'info', 'bot', 'general', 'create voice channel'];
	try {
		bannedList.forEach((name) => {
			if (name === original) {
				send("Sorry, you can't change the name of this channel.");
				return;
			}
			if (name === newName) {
				send("Sorry, you can't change " + original + "\'s name because another channel has this name already.");
				return;
			}
		})
		message.guild.channels.cache.forEach((channel) => {
			if (channel.name === original) {
				channel.edit({name: newName}).then(updated => console.log('The channel ' + original + ' has been changed to ' + newName + '.')).catch(console.error);
			}
		})
	} catch (e) {
		send("Sorry, that channel was not found. Check your input and try again.");
	}
}

// Sends an embed with available stock info that the bot can retrieve.
function stockInfo() {
	const currencyEmbed = new Discord.MessageEmbed()
	.setColor('800000')
	.setTitle('Stock Info Codes')
	.addFields(
		{name: 'Open', value: 'open'},
		{name: 'Close', value: 'close'},
		{name: 'High', value: 'high'},
		{name: 'Low', value: 'low'},
		{name: 'Adjusted Close', value: 'adjclose'},
		{name: 'Volume', value: 'volume'},
		{name: 'Dividend Amount', value: 'divamount'},
		{name: 'Split Coefficient', value: 'splitcof'},
	);
	console.log('Stock info has been requested.');
	send(currencyEmbed);
}

// Sends an embed with the requested information about a stock.
async function getStock(info) {
	console.log('A stock has been requested.');
	try {
		let symbol = '';
		if (info.includes(':')) {
			symbol = info.substring(5, info.indexOf(':')).toUpperCase();
		} else {
			symbol = info.substring(5);
		}
		let responseType = info.substring(info.indexOf(':') + 1);
		const response = await fetch('https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=' + symbol + '&apikey=' + process.env.STOCKS_API_KEY);
		const data = await response.json();
		const infoResponse = await fetch('https://www.alphavantage.co/query?function=OVERVIEW&symbol=' + symbol + '&apikey=' + process.env.STOCKS_API_KEY);
    	const infoData = await infoResponse.json();
		let date = data["Meta Data"]["3. Last Refreshed"];
		let whatToSend = "";
		if (!info.includes(':')) {
			let theFields = [];
			let dailyInfo = ['1. open', '4. close', '3. low', '2. high', '5. adjusted close', '6. volume', '7. dividend amount'];
			let infoToGrab = ['Name', 'AssetType', 'Industry', 'Sector', 'FullTimeEmployees', 'Exchange', 'Country', 'Currency', 'EPS', 'RevenuePerShareTTM', 'MarketCapitalization', 'ProfitMargin', 'QuarterlyEarningsGrowthYOY', 'QuarterlyRevenueGrowthYOY', '52WeekHigh', '52WeekLow', '50DayMovingAverage', '200DayMovingAverage', 'SharesFloat', 'SharesShort', 'PayoutRatio', 'LastSplitFactor', 'LastSplitDate'];
			for (var i = 0; i < dailyInfo.length; i++) {
				let temp = dailyInfo[i].substring(3);
				let newTemp = '';
				for (var j = 0; j < temp.length; j++) {
					if (j == 0 || (j >= 1 && temp.charAt(j-1) == ' ')) {
						newTemp+=temp.charAt(j).toUpperCase();
					} else {
						newTemp+=temp.charAt(j);
					} 
				}
				newTemp += ':';
				theFields.push({name: newTemp, value: data["Time Series (Daily)"][date][dailyInfo[i]], inline: true});
			}
			theFields.push({name: '\u200B', value: '\u200B'});
			for (var i = 0; i < infoToGrab.length; i++) {
				let temp = '';
				for (var j = 0; j < infoToGrab[i].length; j++) {
					if (isCapital(infoToGrab[i].charAt(j))) {
						if (i <= infoToGrab.length - 1 && isCapital(infoToGrab[i].charAt(j+1)) && isCapital(infoToGrab[i].charAt(j-1))) {
							temp+=infoToGrab[i].charAt(j);
						} else {
							temp+=' ' + infoToGrab[i].charAt(j);
						}
					} else {
						temp+=infoToGrab[i].charAt(j);
					}
				}
				temp+=': ';
				theFields.push({name: temp, value: infoData[infoToGrab[i]], inline: true});
			}
			let moreFields = theFields.slice(25);
			theFields = theFields.slice(0, 25);
			const stockEmbedOne = {
				color: '03fc3d',
				title: 'Extended Stock Information for ' + infoData.Name + ' (' + symbol.toUpperCase() + '):',
				description: 'Below is the data for the stock you requested, pulled from [Alpha Vantage](https://www.alphavantage.co/). This data was last updated on ' + data["Meta Data"]["3. Last Refreshed"] + '. Note that if all data below displays as undefined, [Alpha Vantage](https://www.alphavantage.co/) probably doesn\'t have any data for the company. If you feel like this could be a mistake, please look it up manually on [Alpha Vantage](https://www.alphavantage.co/) before consulting the server owner.',
				fields: theFields
			}
			const stockEmbedTwo = {
				color: '03fc3d',
				fields: moreFields
			}
			send({embed: stockEmbedOne});
			send({embed: stockEmbedTwo});
			return;
		} else {
			switch (responseType) {
				case 'open':
					whatToSend = "The open price for " + symbol + " is " + data["Time Series (Daily)"][date]["1. open"] + ".";
					break;
				case 'close':
					whatToSend = "The close price for " + symbol + " is " + data["Time Series (Daily)"][date]["4. close"] + ".";
					break;
				case 'high':
					whatToSend = "The high price for " + symbol + " is " + data["Time Series (Daily)"][date]["2. high"] + ".";
					break;
				case 'low':
					whatToSend = "The low price for " + symbol + " is " + data["Time Series (Daily)"][date]["3. low"] + ".";
					break;
				case 'adjclose':
					whatToSend = "The Adjusted Close price for " + symbol + " is " + data["Time Series (Daily)"][date]["5. adjusted close"] + ".";
					break;
				case 'volume':
					whatToSend = "The volume price for " + symbol + " is " + data["Time Series (Daily)"][date]["6. volume"] + ".";
					break;
				case 'divamount':
					whatToSend = "The dividend amount for " + symbol + " is " + data["Time Series (Daily)"][date]["7. dividend amount"] + ".";
					break;
				case 'splitcof':
					whatToSend = "The split coefficient for " + symbol + " is " + data["Time Series (Daily)"][date]["8. split coefficient"] + ".";
					break;
				default:
					whatToSend = "Sorry, try again";
			}
			whatToSend += "\n(Last updated on " + date + ").";
			send(whatToSend);
			return;
		}
	} catch (e) {
		console.error(e);
		send("Couldn't retrieve stock info, check your input and try again.");
	}
}

function isCapital(c) {
    return c.toUpperCase() === c && !Number.isInteger(Number.parseInt(c));
}

// Sends an embed with the available country codes for currency exchange. Otherwise, it will convert between the requested currencies.
async function currency(info) {
	console.log('Currency info has been requested.');
	if (info === 'currencycodes') {
		const mapEmbed = new Discord.MessageEmbed()
			.setColor('800000')
			.setTitle('Exchange Codes')
			.addFields(
				{name: 'CAD', value: 'Canadian Dollar', inline: true},
				{name: 'HKD', value: 'Hong Kong Dollar', inline: true},
				{name: 'ISK', value: 'Icelandic Krona', inline: true},
				{name: 'PHP', value: 'Philippine Peso', inline: true},
				{name: 'DKK', value: 'Danish Krone', inline: true},
				{name: 'HUF', value: 'Hungarian Forint', inline: true},
				{name: 'CZK', value: 'Czech Koruna', inline: true},
				{name: 'GBP', value: 'Pound Sterling', inline: true},
				{name: 'RON', value: 'Romanian Leu', inline: true},
				{name: 'SEK', value: 'Swedish Krona', inline: true},
				{name: 'IDR', value: 'Indonesian Rupiah', inline: true},
				{name: 'INR', value: 'Indian Rupee', inline: true},
				{name: 'BRL', value: 'Brazilian Real', inline: true},
				{name: 'RUB', value: 'Russian Ruble', inline: true},
				{name: 'HRK', value: 'Croatian Kuna', inline: true},
				{name: 'JPY', value: 'Japanese Yen', inline: true},
				{name: 'THB', value: 'Thai Baht', inline: true},
				{name: 'CHF', value: 'Swiss Franc', inline: true},
				{name: 'EUR', value: 'Euro', inline: true},
				{name: 'MYR', value: 'Malaysian Ringgit', inline: true},
				{name: 'BGN', value: 'Bulgarian Lev', inline: true},
				{name: 'TRY', value: 'Turkish Lira', inline: true},
				{name: 'CNY', value: 'Chinese Yuan', inline: true},
				{name: 'NOK', value: 'Norwegian Krone', inline: true},
				{name: 'NZD', value: 'New Zealand Dollar', inline: true},
				{name: 'ZAR', value: 'South African Rand', inline: true},
				{name: 'USD', value: 'United States Dollar', inline: true},
				{name: 'MXN', value: 'Mexican Peso', inline: true},
				{name: 'SGD', value: 'Singapore Dollar', inline: true},
				{name: 'AUD', value: 'Australian Dollar', inline: true},
				{name: 'ILS', value: 'Israeli New Shekel', inline: true},
				{name: 'KRW', value: 'South Korean Yuan', inline: true},
				{name: 'PLN', value: 'Poland Zloty', inline: true},
			);
		send(mapEmbed);
		return;
	}
	let fromCode = (info.substring(8, 11)).toUpperCase();
	let toCode = (info.substring(11, 14)).toUpperCase();
	let price = parseFloat(info.substring(14));
	try {
		if (info.length < 9) {
			throw "Command incorrectly formatted";
		}
		const response = await fetch('https://api.exchangeratesapi.io/latest?base=' + fromCode);
		let data = await response.json();
		let toPriceRate = data.rates[toCode];
		let finalPrice = price * toPriceRate;
		let currencyMap = new Map();
		currencyMap.set('CAD', 'Canadian Dollar');
		currencyMap.set('HKD', 'Hong Kong Dollar');
		currencyMap.set('ISK', 'Icelandic Krona');
		currencyMap.set('PHP', 'Philippine Peso');
		currencyMap.set('DKK', 'Danish Krone');
		currencyMap.set('HUF', 'Hungarian Forint');
		currencyMap.set('CZK', 'Czech Koruna');
		currencyMap.set('GBP', 'Pound Sterling');
		currencyMap.set('RON', 'Romanian Leu');
		currencyMap.set('SEK', 'Swedish Krona');
		currencyMap.set('IDR', 'Indonesian Rupiah');
		currencyMap.set('INR', 'Indian Rupee');
		currencyMap.set('BRL', 'Brazilian Real');
		currencyMap.set('RUB', 'Russian Ruble');
		currencyMap.set('HRK', 'Croatian Kuna');
		currencyMap.set('JPY', 'Japanese Yen');
		currencyMap.set('THB', 'Thai Baht');
		currencyMap.set('CHF', 'Swiss Franc');
		currencyMap.set('EUR', 'Euro');
		currencyMap.set('MYR', 'Malaysian Ringgit');
		currencyMap.set('BGN', 'Bulgarian Lev');
		currencyMap.set('TRY', 'Turkish Lira');
		currencyMap.set('CNY', 'Chinese Yuan');
		currencyMap.set('NOK', 'Norwegian Krone');
		currencyMap.set('NZD', 'New Zealand Dollar');
		currencyMap.set('ZAR', 'South African Rand');
		currencyMap.set('USD', 'United States Dollar');
		currencyMap.set('MXN', 'Mexican Peso');
		currencyMap.set('SGD', 'Singapore Dollar');
		currencyMap.set('AUD', 'Australian Dollar');
		currencyMap.set('ILS', 'Israeli New Shekel');
		currencyMap.set('KRW', 'South Korean Yuan');
		currencyMap.set('PLN', 'Poland Zloty');
		const currencyEmbed = new Discord.MessageEmbed()
			.setColor('0ead58')
			.setTitle('Currency Exchange')
			.addFields(
				{name: 'From: ', value: currencyMap.get(fromCode)},
				{name: 'To: ', value: currencyMap.get(toCode)},
				{name: 'Initial Amount: ', value: price.toFixed(3)},
				{name: 'Multiplier: ', value: data.rates[toCode].toFixed(3)},
				{name: 'Converted Amount: ', value: finalPrice.toFixed(3)},
				);
			send(currencyEmbed);
	} catch(e) {
		send('Sorry, please check your input and try again. Valid codes can be found at https://api.exchangeratesapi.io/latest?base=USD');
	}
}

// Retrieves Matt's Minecraft server information.
async function mc() {
	console.log('Minecraft server information has been requested.');
	const response = await fetch('https://api.mcsrvstat.us/2/kwikmatt.ddns.net');
	let data = await response.json();
	var status = data.online;
	var state = "";
	if (status) {
		state = "Online";
	} else {
		state = "Offline";
	}
	var playersList = "";
	try {
		for (var i = 0; i < data.players.list.length; i++) {
			playersList+=data.players.list[i] + "\n";
		}	
	} catch(e) {
		playersList = "No one is online!";
	}
	try {
		var website = process.env.WEBSITE;
		var version = data.version;
		const mcEmbed = new Discord.MessageEmbed()
			.setColor('0ead58')
			.setTitle('Minecraft Server')
			.setThumbnail("https://store-images.s-microsoft.com/image/apps.45782.9007199266731945.debbc4f1-cde0-491b-8c6f-b6b015eecab6.4716cccc-5f37-4bb5-9db1-0c1dbc99003f?mode=scale&q=90&h=200&w=200&background=%23000000")
			.addFields(
				{name: 'Server', value: 'kwikmatt.ddns.net'},
				{name: 'Version', value: version},
				{name: 'Status', value: state},
				{name: 'Players Online', value: data.players.online + '/' + data.players.max},
				{name: 'Currently Active Players', value: playersList},
			);
		send(mcEmbed);
	} catch (e) {
		send("The server is currently offline.");
	}
}

// Retrieves a random number, either an integer or double as requested by the message.
function getRandom(n) {
	console.log("A random number has been requested.");
	if (n.endsWith("double")) {
		var commaIndex = n.indexOf(",");
		var minNumber = parseFloat(n.substring(7, commaIndex));
		var endParenIndex = n.indexOf(")");
		var maxNumber = parseFloat(n.substring((commaIndex+1), endParenIndex));
		var range = maxNumber - minNumber;
		return (Math.random() * range) + minNumber;
	} else if (n.endsWith("int")) {
		var commaIndex = n.indexOf(",");
		var minNumber = parseInt(n.substring(7, commaIndex));
		var endParenIndex = n.indexOf(")");
		var maxNumber = parseInt(n.substring((commaIndex+1), endParenIndex));
		var range = maxNumber - minNumber;
		return Math.floor((Math.random() * range) + minNumber);
	} else {
		send("Sorry, check your random format and try again.");
	}
}

// Used for the date command.
function convertSeconds(seconds) {
	var numdays = Math.floor(seconds / 86400);
	var numhours = Math.floor((seconds % 86400) / 3600);
	var numminutes = Math.floor(((seconds % 86400) % 3600) / 60);
	var numseconds = ((seconds % 86400) % 3600) % 60;
	return numdays + " days, " + numhours + " hours, " + numminutes + " minutes, and " + (numseconds.toFixed(0)) + " seconds";
}

// Used for the date command.
function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+ minutes : minutes;
  var strTime = hours + ':' + minutes + '' + ampm;
  return "" + strTime;
}

// Gets all weather information from a specified zip code.
async function getWeather(zip, message) {
	console.log("Weather information has been requested.");
	const weath = await fetch('http://api.openweathermap.org/data/2.5/weather?zip=' + zip + ',us&appid=' + process.env.WEATHER_API_KEY + '&units=imperial');
	let response = await weath.json();
	try {
		const weatherEmbed = new Discord.MessageEmbed()
		.setColor('001aff')
		.setTitle('Weather Info for ' + response.name)
		.setThumbnail("http://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png")
		.addFields(
			{name: 'Description: ', value: response.weather[0].main, inline: true},
			{name: 'Feels Like: ', value: response.main.feels_like + "°F"},
			{name: 'Temperature: ', value: (response.main.temp).toFixed(1) + '°F'},
			{name: 'Today\'s High: ', value: (response.main.temp_max).toFixed(1) + '°F'},
			{name: 'Today\'s Low: ', value: (response.main.temp_min).toFixed(1) + '°F'},
			{name: 'Wind: ', value: response.wind.speed + ' mph at ' + response.wind.deg + '°'},
			{name: 'Humidity: ', value: response.main.humidity + '%'},
		);
		try {
			if (response.main.temp < 32) {
				message.react('🥶');
			} else if (response.main.temp > 85) {
				message.react('😓');
			}
			let id = response.weather[0].id.toString().charAt(0);
			var emoji;
			if (id === '2') {
				emoji = '🌩️';
			} else if (id === '3') {
				emoji = '☔';
			} else if (id === '5') {
				emoji = '🌧️';
			} else if (id === '6') {
				emoji = '❄️';
			} else if (id === '7') {
				emoji = '🌫️';
			} else if (response.weather[0].id.toString() === '800') {
				emoji = '🌞';
			} else if (id === '8') {
				emoji = '☁️';
			}
			message.react(emoji);
		} catch (e) {
			console.log("Something went wrong while reacting.");
			console.log(e);
		}
		send(weatherEmbed);
	} catch (e) {
		send("I couldn't find the weather for that zip code because it doesn't exist. Please try again.");
	}
	
}

// Mutes or unmutes all members of the current voice channel, as indicated by the boolean parameter setMute.
function mute(message, setMute) {
	console.log('Muted command requested.');
	if (message.member.voice.channel) {
    	let channel = message.guild.channels.cache.get(message.member.voice.channel.id);
    	for (const [memberID, member] of channel.members) {
    		member.voice.setMute(setMute);
    	}
    } else {
    	message.reply('You need to join a voice channel first!');
  	}
}

//Send daily updates to my server
function scheduleJobs() {
	let morning = new cron.CronJob('0 ' + (herokuOffset+8) + ' * * *', morningUpdate);
	let afternoon = new cron.CronJob('5 ' + (herokuOffset+13) + ' * * *', afternoonUpdate);
	let evening = new cron.CronJob('0 ' + (herokuOffset+17) + ' * * *', eveningUpdate);
	morning.start();
	afternoon.start();
	evening.start();
}

function morningUpdate() {
	getUpdate(0);
}
function afternoonUpdate() {
	getUpdate(1);
}
function eveningUpdate() {
	getUpdate(2);
}
async function getUpdate(type) {
    let zip = '08854';
	const weath = await fetch('http://api.openweathermap.org/data/2.5/weather?zip=' + zip + ',us&appid=' + process.env.WEATHER_API_KEY + '&units=imperial');
    let weatherData = await weath.json();
    let url = 'http://newsapi.org/v2/top-headlines?sortBy=popularity&country=us&apiKey=' + process.env.NEWS_API_KEY;
	const newsResponse = await fetch(url);
    const newsData = await newsResponse.json();
	try {
        let theFields = [
            {
                name: '\u200B',
                value: '\u200B',
            },
            {
                name: 'Weather for ' + weatherData.name + ': ',
                value: '\u200B'
            },
            {
                name: 'Current Description: ',
                value: weatherData.weather[0].main,
                inline: true
            },
            {
                name: 'Current Feels Like: ',
                value: weatherData.main.feels_like + '°F',
                inline: true
            },
            {
                name: 'Current Temperature: ',
                value: (weatherData.main.temp).toFixed(1) + '°F',
                inline: true
            },
            {
                name: 'Today\'s Low: ',
                value: (weatherData.main.temp_min).toFixed(1) + '°F',
                inline: true
            },
            {
                name: 'Today\'s High: ',
                value: (weatherData.main.temp_max).toFixed(1) + '°F',
                inline: true
            },
            {
                name: 'Current Wind: ',
                value: weatherData.wind.speed + ' mph at ' + weatherData.wind.deg + '°',
                inline: true
            },
            {
                name: 'Humidity: ',
                value: weatherData.main.humidity + '%',
                inline: true
            },
            {
                name: '\u200B',
                value: '\u200B'
            }
        ];
        for (var i = 0; i < 10; i++) {
            if (i == 0) {
                theFields.push({name: 'Top News Headlines: ', value: '[' + newsData.articles[i].title + '](' + newsData.articles[i].url + ')\n\n'});
            } else {
                theFields.push({name: '\u200B', value: '[' + newsData.articles[i].title + '](' + newsData.articles[i].url + ')\n\n'});
            }
        }
		const dailyUpdateEmbed = {
            color: '00f7ff',
            title: getUpdateTitle(type),
            description: 'Here is your update. Weather data provided by [openweathermap](https://openweathermap.org/) and news data provided by [newsapi](https://newsapi.org/).\n',
            thumbnail: {
                url: 'http://openweathermap.org/img/wn/' + weatherData.weather[0].icon + '@2x.png'
            },
            fields : theFields
		}
        client.channels.cache.get(dailyUpdateChannelID).send({embed: dailyUpdateEmbed});
	} catch (e) {
        console.error(e);
    }
}
function getUpdateTitle(time) {
	let theDate = '';
	let today = new Date(new Date().toLocaleString('en-US', {timezone: "America/New_York"}));
	let weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	if (time == 0) {
		theDate += 'Morning Update for ';
	} else if (time == 1) {
		theDate += 'Afternoon Update for ';
	} else if (time == 2) {
		theDate += 'Evening Update for ';
	}
	return theDate + weekdays[today.getDay()] + ', ' + months[today.getMonth()] + ' ' + today.getDate() + ', ' + today.getFullYear() + '.';
}

async function getMovieData(msg) {
	let request = msg.content;
	console.log('Movie Request: ' + request);
	let searchTerm = request.substring(6);
	searchTerm = searchTerm.replace(/_/g, '%20').toLowerCase();
	try {
		let link = 'https://yts.mx/api/v2/list_movies.json?order_by=asc&query_term=' + searchTerm;
		console.log(link);
		let response = await fetch(link);
		let data = await response.json();
		let temp = data['data']['movies'][0];
		//create embed
		let fields = [
			{
				name: 'Year: ',
				value: temp['year'],
				inline: true
			},
			{
				name: 'Genre: ',
				value: temp['genres'][0],
				inline: true
			},
			{
				name: 'Stars: ',
				value: temp['rating'] + '/10',
				inline: true
			},
			{
				name: 'Runtime: ',
				value: temp['runtime'] + ' mins',
				inline: true
			},
			{
				name: 'Rating: ',
				value: temp['mpa_rating'] ? temp['mpa_rating'] : 'Not Available',
				inline: true
			},
			{
				name: 'Language: ',
				value: getLang(temp['language']),
				inline: true
			},
			{
				name: 'YouTube Trailer: ',
				value: '[Click Here](https://www.youtube.com/watch?v=' + temp['yt_trailer_code'] + ')',
				inline: true
			},
			{
				name: 'Summary',
				value: temp['summary']
			},
		];
		fields.push({name: '\u200B', value: '[More on IMDB](https://imdb.com/title/' + temp['imdb_code'] + '/)'});
		fields.push({name: '\u200B', value: '[View on YTS](' + temp['url'] + ')'});
		for (var i = 0; i < temp['torrents'].length; i++) {
			fields.push({name: '\u200B', value: '[' + temp['torrents'][i]['quality'] + ' (' + temp['torrents'][i]['size'] + ')](' + temp['torrents'][i]['url'] + ')'});
		}
		const movieEmbed = new Discord.MessageEmbed()
			.setColor('black')
			.setTitle(temp['title'])
			.setThumbnail(temp['large_cover_image'])
			.addFields(fields);
			send(movieEmbed);
	} catch (e) {
		send('Couldn\'t find a movie with the name "' + searchTerm.replace(/%20/g, ' ') + '". Please try another. If you believe this is a mistake, contact matt.');
		console.log(e);
	}
}

function getLang(langCode) {
	var codeMap = new Map();
	codeMap.set("af", "Afrikaans");
	codeMap.set("ar", "Arabic");
	codeMap.set("az", "Azeri");
	codeMap.set("be", "Belarusian");
	codeMap.set("bg", "Bulgarian");
	codeMap.set("bs", "Bosnian");
	codeMap.set("ca", "Catalan");
	codeMap.set("cs", "Czech");
	codeMap.set("cy", "Welsh");
	codeMap.set("da", "Danish");
	codeMap.set("de", "German");
	codeMap.set("dv", "Divehi");
	codeMap.set("el", "Greek");
	codeMap.set("en", "English");
	codeMap.set("eo", "Esperanto");
	codeMap.set("es", "Spanish");
	codeMap.set("et", "Estonian");
	codeMap.set("eu", "Basque");
	codeMap.set("fa", "Farsi");
	codeMap.set("fi", "Finnish");
	codeMap.set("fo", "Faroese");
	codeMap.set("fr", "French");
	codeMap.set("gl", "Galician");
	codeMap.set("gu", "Gujarati");
	codeMap.set("he", "Hebrew");
	codeMap.set("hi", "Hindi");
	codeMap.set("hr", "Croatian");
	codeMap.set("hu", "Hungarian");
	codeMap.set("hy", "Armenian");
	codeMap.set("id", "Indonesian");
	codeMap.set("in", "Indonesian");
	codeMap.set("is", "Icelandic");
	codeMap.set("it", "Italian");
	codeMap.set("ja", "Japanese");
	codeMap.set("ka", "Georgian");
	codeMap.set("kk", "Kazakh");
	codeMap.set("kn", "Kannada");
	codeMap.set("ko", "Korean");
	codeMap.set("kok", "Konkani");
	codeMap.set("ky", "Kyrgyz");
	codeMap.set("lt", "Lithuanian");
	codeMap.set("lv", "Latvian");
	codeMap.set("mi", "Maori");
	codeMap.set("mk", "Macedonian");
	codeMap.set("mn", "Mongolian");
	codeMap.set("mr", "Marathi");
	codeMap.set("ms", "Malay");
	codeMap.set("mt", "Maltese");
	codeMap.set("nb", "Norwegian");
	codeMap.set("nl", "Dutch");
	codeMap.set("nn", "Norwegian");
	codeMap.set("ns", "Northern Sotho");
	codeMap.set("pa", "Punjabi");
	codeMap.set("pl", "Polish");
	codeMap.set("ps", "Pashto");
	codeMap.set("pt", "Portuguese");
	codeMap.set("qu", "Quechua");
	codeMap.set("ro", "Romanian");
	codeMap.set("ru", "Russian");
	codeMap.set("sa", "Sanskrit");
	codeMap.set("se", "Sami");
	codeMap.set("sk", "Slovak");
	codeMap.set("sl", "Slovenian");
	codeMap.set("sq", "Albanian");
	codeMap.set("sr", "Serbian");
	codeMap.set("sv", "Swedish");
	codeMap.set("sw", "Swahili");
	codeMap.set("syr", "Syriac");
	codeMap.set("ta", "Tamil");
	codeMap.set("te", "Telugu");
	codeMap.set("th", "Thai");
	codeMap.set("tl", "Tagalog");
	codeMap.set("tn", "Tswana");
	codeMap.set("tr", "Turkish");
	codeMap.set("tt", "Tatar");
	codeMap.set("ts", "Tsonga");
	codeMap.set("uk", "Ukrainian");
	codeMap.set("ur", "Urdu");
	codeMap.set("uz", "Uzbek");
	codeMap.set("vi", "Vietnamese");
	codeMap.set("xh", "Xhosa");
	codeMap.set("zh", "Chinese");
	codeMap.set("zu", "Zulu");
	return codeMap.get(langCode);
}