const Discord = require('discord.js');
const weather = require('openweather-apis');
const fetch = require('node-fetch');
const client = new Discord.Client();

const prefix = '-';

client.once('ready', () => {
  console.log('Kwikmatt bot is online!');
  client.user.setActivity("-help for commands!"); 
});

client.on('guildMemberAdd', member => {
    member.guild.channels.cache.get('548579154824527892').send('**' + member.user.username + '** has joined the server! :slight_smile: ');
    var role= member.guild.roles.cache.find(role => role.name === "People");
	member.roles.add(role); 
});

client.on('guildMemberRemove', member => {
    member.guild.channels.cache.get('548579154824527892').send('**' + member.user.username + '** has left the server! :sob: ');
});


client.on('message', message => {

	if (!message.content.startsWith(prefix) || message.author.bot) return;
	const args = message.content.slice(prefix.length).split(" ");
	const command = args.shift().toLowerCase();
	var base = "";
	//Commands that can receive additional arguments
	if (command.includes('weather') || command.includes('random') || command.includes('currency') || command.includes('stock') || command.includes('sb')) {
		base = command;
	} 
	adminRole = message.guild.roles.cache.find(role => role.name === "Owner");
  	console.log("Command is sending.");
  	//Commands executable by anyone with the admin role name
    if (message.member.roles.cache.has(adminRole.id)) {
    	 switch (command) {
	    case 'm':
	      mute(message, true);
	      break;
	    case 'u':
	      mute(message, false);
	      break;
	    case 'help':
	    	sendMessage("help");  
	    	break;
	    case base:
	    	if (base.includes('sb')) {
	    		soundboard(message, command);
	    	} else {
	    		sendMessage(command);
	    	}
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
	    default:
	    	sendMessage("invalid");
 		}
    } else { //Commands that can be executed by anyone in the server
    	switch (command) {
	    case 'help':
	    	sendMessage("help");  
	    	break;
	    case base:
	    	if (base.includes('sb')) {
	    		soundboard(message, command);
	    	} else {
	    		sendMessage(command);
	    	}
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
	    case 'uptime':
	    	sendMessage("uptime");
	    	break;
	    case 'minecraft':
	    	sendMessage("status");
	    	break;
	    case 'how':
	    	send("This bot was created by <@401505856870678529> using the Discord.js dependency in the JavaScript programming language. Want more commands? Please dm <@401505856870678529>, he's always looking for suggestions!");
	    	break;
	    case 'website':
	    	send("View Matthew Vandeneberg's website at http://" + process.env.WEBSITE);
	    	break;
    	case 'currency':
	    	sendMessage("currency");
	    	break;
	    case 'stock':
	    	sendMessage("stock");
	    	break;
	    default:
	    	sendMessage("invalid");
  		}
	}
});

function soundboard(message, command) {
	if (command.includes('sbhelp')) {
		const helpEmbed = new Discord.MessageEmbed()
		.setColor('black')
		.setTitle('Available Sounds')
		.setDescription('Play any of the available sounds below.')
		.addFields(
		{name: 'akbar', value: 'Allahu Akbar makes you happy.'},
		{name: 'avocadosfrommexico', value: 'The sound that will make you happy.'},
		{name: 'bruh', value: 'bruh.'},
		{name: 'convert', value: 'self explantory'},
		{name: 'dolphin', value: 'flight reacts dolphin sound effect'},
		{name: 'dontpull', value: 'flight reacts dont pull ahhhhhhhhh'},
		{name: 'failures', value: 'EDP445 shares some words of wisdom'},
		{name: 'itsshowtime', value: 'EDP445 shares some more words of wisdom.'},
		{name: 'letmebeclear', value: 'Obama says \"Let me be clear.\"'},
		{name: 'nongrs', value: 'The classic I do not associate meme.'},
		{name: 'ohniggayougay', value: 'Plays the \"Oh nigga you gay\" vine.'},
		{name: 'prit', value: 'And the Jay-Z song was on.'},
		{name: 'spongebob', value: 'Someone finds out that it\'s not actually spongebob.'},
		{name: 'whoa', value: 'Peter says whoa. A lot of times.'}
		);
		send(helpEmbed);
	} else {
		var voiceChannel = message.member.voice.channel;
		let filename = command.substring(2);
		console.log(command);
		voiceChannel.join()
		.then(connection => {
	    	const dispatcher = connection.play('audio/' + filename + '.mp3');
	    	dispatcher.on("finish", end => {
	        	voiceChannel.leave();
	    	});
		})
		.catch(error => send("Couldn't find that audio file. Contact Matt to request additional sounds."));
	}

	
}

function send(toSend) {
	channel = client.channels.cache.get(process.env.BOT_CHANNEL);
    channel.send(toSend);
}

function sendMessage(msg) {
	var toSend;
	if (msg === "help") {
		const helpEmbed = new Discord.MessageEmbed()
		.setColor('001aff')
		.setTitle('Help')
		.setDescription('Hi! I am kwikmatt\'s Discord bot! Here is the list of commands that I can do: ')
		.addFields(
			{name: '-currency', value: 'Get current currency exchange information, formatted as \"-currency[from code][to code][price]\", example: \"-currencyUSDCAD10.68\" Use -currencycodes for a list of codes.'},
			{name: '-date', value: 'Displays the current date.'},
			{name: '-help', value: 'Open this help message again.'},
			{name: '-how', value: 'How was this bot created?'},
			{name: '-info', value: 'Displays information about the Kwikmatt Server.'},
			{name: '-m', value: 'Mute all in a voice channel (Admins only).'},
			{name: '-minecraft', value: 'Displays the kwikmatt server ip if you are a part of the minecraft server.'},
			{name: '-time', value: 'Displays the current time.'},
			{name: '-random', value: 'Generate a random number using the following scheme: \"-random(min,max)int\". Use \"int\" for integer, or \"double\" for decimal number.'},
			{name: '-sb', value: 'Use the soundboard to play a custom sound. Use -sb<sound>, see -sbhelp.'},
			{name: '-stock', value: 'Gets stock info for a given symbol. Use -stockinfo to get the info you want; be sure to follow the format -stock[symbol]:[info].'},
			{name: '-u', value: 'Unmute all in a voice channel (Admins only).'},
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
		getWeather(zip);
		return;
	} else if (msg === "date") {
		var usaTime = new Date().toLocaleString("en-US", {timeZone: "America/New_York"});
		var today = new Date(usaTime);
		var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
		var dayOfWeek = weekday[today.getDay()];
		toSend = "Today is " + dayOfWeek + ", " + (today.getMonth()+1) + "-" + today.getDate() + "-" + today.getFullYear() + "."
	} else if (msg === "time") {
		var usaTime = new Date().toLocaleString("en-US", {timeZone: "America/New_York"});
		toSend = formatAMPM(new Date(usaTime));
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
	console.log("about to send");
	send(toSend);
}



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
	send(currencyEmbed);
}

async function getStock(info) {
	
	try {
		let symbol = info.substring(5, info.indexOf(':')).toUpperCase();
		let responseType = info.substring(info.indexOf(':') + 1);
		const response = await fetch('https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=' + symbol + '&apikey=' + process.env.STOCKS_API_KEY);
		const data = await response.json();
		let date = data["Meta Data"]["3. Last Refreshed"];
		let whatToSend = "";
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
	} catch (e) {
		console.error(e);
		send("Couldn't retrieve stock info, check your input and try again.");
	}
	
}

async function currency(info) {
	if (info === 'currencycodes') {
		const mapEmbed = new Discord.MessageEmbed()
			.setColor('800000')
			.setTitle('Exchange Codes')
			.addFields(
				{name: 'CAD', value: 'Canadian Dollar'},
				{name: 'HKD', value: 'Hong Kong Dollar'},
				{name: 'ISK', value: 'Icelandic Krona'},
				{name: 'PHP', value: 'Philippine Peso'},
				{name: 'DKK', value: 'Danish Krone'},
				{name: 'HUF', value: 'Hungarian Forint'},
				{name: 'CZK', value: 'Czech Koruna'},
				{name: 'GBP', value: 'Pound Sterling'},
				{name: 'RON', value: 'Romanian Leu'},
				{name: 'SEK', value: 'Swedish Krona'},
				{name: 'IDR', value: 'Indonesian Rupiah'},
				{name: 'INR', value: 'Indian Rupee'},
				{name: 'BRL', value: 'Brazilian Real'},
				{name: 'RUB', value: 'Russian Ruble'},
				{name: 'HRK', value: 'Croatian Kuna'},
				{name: 'JPY', value: 'Japanese Yen'},
				{name: 'THB', value: 'Thai Baht'},
				{name: 'CHF', value: 'Swiss Franc'},
				{name: 'EUR', value: 'Euro'},
				{name: 'MYR', value: 'Malaysian Ringgit'},
				{name: 'BGN', value: 'Bulgarian Lev'},
				{name: 'TRY', value: 'Turkish Lira'},
				{name: 'CNY', value: 'Chinese Yuan'},
				{name: 'NOK', value: 'Norwegian Krone'},
				{name: 'NZD', value: 'New Zealand Dollar'},
				{name: 'ZAR', value: 'South African Rand'},
				{name: 'USD', value: 'United States Dollar'},
				{name: 'MXN', value: 'Mexican Peso'},
				{name: 'SGD', value: 'Singapore Dollar'},
				{name: 'AUD', value: 'Australian Dollar'},
				{name: 'ILS', value: 'Israeli New Shekel'},
				{name: 'KRW', value: 'South Korean Yuan'},
				{name: 'PLN', value: 'Poland Zloty'},
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

async function mc() {
	const response = await fetch('https://api.mcsrvstat.us/2/mattvandenberg.com');
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
				{name: 'Server', value: website},
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


function convertSeconds(seconds) {
	var numdays = Math.floor(seconds / 86400);
	var numhours = Math.floor((seconds % 86400) / 3600);
	var numminutes = Math.floor(((seconds % 86400) % 3600) / 60);
	var numseconds = ((seconds % 86400) % 3600) % 60;
	return numdays + " days, " + numhours + " hours, " + numminutes + " minutes, and " + (numseconds.toFixed(0)) + " seconds";
}

function getRandom(n) {
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

function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return "It is " + strTime;
}

async function getWeather(zip) {
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
		send(weatherEmbed);
	} catch (e) {
		send("I couldn't find the weather for that zip code because it doesn't exist. Please try again.");
	}
	
}

function mute(message, setMute) {
  if (message.member.voice.channel) {
    let channel = message.guild.channels.cache.get(message.member.voice.channel.id);
    for (const [memberID, member] of channel.members) {
      member.voice.setMute(setMute);
    }
  } else {
    message.reply('You need to join a voice channel first!');
  }
}

client.login(process.env.BOT_TOKEN);