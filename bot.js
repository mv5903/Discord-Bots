const Discord = require('discord.js');
const weather = require('openweather-apis');
const fetch = require('node-fetch');
const client = new Discord.Client();

const prefix = '-';

client.once('ready', () => {
  console.log('Kwikmatt bot is online!');
});

client.on('guildMemberAdd', member => {
	const channel = member.guild.channels.cache.find(ch => ch.name === 'member-log');
	console.log("Added!");
  	// Do nothing if the channel wasn't found on this server
  	var role= member.guild.roles.cache.find(role => role.name === "Regulars");
	member.roles.add(role);
});

client.on('guildMemberAdd', member => {
	infoChannel = process.env.WELCOME_CHANNEL;
    member.guild.channels.cache.get(infoChannel).send('**' + member.user.username + '** has joined the server! :slight_smile: '); 
});

client.on('guildMemberRemove', member => {
	infoChannel = process.env.WELCOME_CHANNEL;
    member.guild.channels.cache.get(infoChannel).send('**' + member.user.username + '** has left the server! :sob: ');
});


client.on('message', message => {

  if (!message.content.startsWith(prefix) || message.author.bot) return;
  const args = message.content.slice(prefix.length).split(" ");
  const command = args.shift().toLowerCase();
  var base = "";
  if (command.includes('weather')) {
  	base = command;
  } 
  if (command.includes('random')) {
  	base = command;
  }
    adminRole = message.guild.roles.cache.find(role => role.name === "Assistant");
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
	    	sendMessage(command);
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
	    default:
	    	sendMessage("invalid");
 		}
    } else {
    	switch (command) {
	    case 'help':
	    	sendMessage("help");  
	    	break;
	    case base:
	    	sendMessage(command);
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
	    default:
	    	sendMessage("invalid");
  		}
	}
});

function sendEmbed(toSend) {
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
			{name: '-date', value: 'Displays the current date.'},
			{name: '-help', value: 'Open this help message again.'},
			{name: '-how', value: 'How was this bot created?'},
			{name: '-info', value: 'Displays information about the Kwikmatt Server.'},
			{name: '-m', value: 'Mute all in a voice channel (Admins only).'},
			{name: '-minecraft', value: 'Displays the kwikmatt server ip if you are a part of the minecraft server.'},
			{name: '-time', value: 'Displays the current time.'},
			{name: '-random', value: 'Generate a random number using the following scheme: \"-random(min,max)int\". Use \"int\" for integer, or \"double\" for decimal number.'},
			{name: '-u', value: 'Unmute all in a voice channel (Admins only).'},
			{name: '-uptime', value: 'Gets my uptime.'},
			{name: '-weather', value: 'Get weather for any zip code, for example, \"-weather&10001\" will show the weather for New York City.'},
			{name: '-website', value: 'View Matthew Vandenberg\'s website.'},
		);
		sendEmbed(helpEmbed);
	} else if (msg.includes("weather")) {
		if (msg.length != 13) {
			send("Please check your formatting and try typing that again.");
			return;
		}
		var zip = msg.substring(8);
		getWeather(zip);
		return;
	} else if (msg === "date") {
		var today = new Date();
		var weekday = new Array(7);
		weekday[0] = "Sunday";
		weekday[1] = "Monday";
		weekday[2] = "Tuesday";
		weekday[3] = "Wednesday";
		weekday[4] = "Thursday";
		weekday[5] = "Friday";
		weekday[6] = "Saturday";
		var dayOfWeek = weekday[today.getDay()];
		toSend = "Today is " + dayOfWeek + ", " + (today.getMonth()+1) + "-" + today.getDate() + "-" + today.getFullYear() + "."
	} else if (msg === "time") {
		toSend = formatAMPM(new Date);
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
	}
	console.log("about to send");
	send(toSend);
}

function send(toSend) {
	channel = client.channels.cache.get(process.env.BOT_CHANNEL);
    channel.send(toSend);
}

async function mc() {
	const response = await fetch('https://api.mcsrvstat.us/2/' + process.env.WEBSITE);
	let data = await response.json();
	var status = data.online;
	var state = "";
	if (status) {
		state = "Online";
	} else {
		state = "Offline";
	}
	var playersList = "";
	if (!("players" in data)) {
		playersList = "No one!";
	} else {
		for (var i = 0; i < data.players.list.length; i++) {
		playersList+=data.players.list[i] + "\n";
		}	
	}
	
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
	sendEmbed(mcEmbed);

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
	console.log(process.env.WEATHER_API_KEY);
	const weath = await fetch('http://api.openweathermap.org/data/2.5/weather?zip=' + zip + ',us&appid= ' + process.env.WEATHER_API_KEY + '&units=imperial');
	let response = await weath.json();
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
	sendEmbed(weatherEmbed);
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