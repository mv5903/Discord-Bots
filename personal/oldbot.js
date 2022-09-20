const Discord = require('discord.js');
const client = new Discord.Client();

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
			client.channels.cache.get('846383787532484653').name = 'OMG: 0';
			break;
		case 'omg':
			let name = client.channels.cache.get('846383787532484653').name;
			console.log(name);
			let newName = 'OMG: ' + ((parseInt(name.substring(5))) + 1);
			console.log(newName);
			client.channels.cache.get('846383787532484653').name = newName;
			console.log(client.channels.cache.get('846383787532484653').name);
			//client.channels.cache.get('846383787532484653').edit({name: newName}).then(updated => console.log('Changed')).catch(console.error);
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


// Used for the date command.
function convertSeconds(seconds) {
	var numdays = Math.floor(seconds / 86400);
	var numhours = Math.floor((seconds % 86400) / 3600);
	var numminutes = Math.floor(((seconds % 86400) % 3600) / 60);
	var numseconds = ((seconds % 86400) % 3600) % 60;
	return numdays + " days, " + numhours + " hours, " + numminutes + " minutes, and " + (numseconds.toFixed(0)) + " seconds";
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
