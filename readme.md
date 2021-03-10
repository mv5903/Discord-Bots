## Welcome to My All-Purpose Discord Bot  

#### Using this bot, you can make it perform a wide variety of tasks! Here are a list of commands that I have implemented for my Discord bot:  

<br>

* Allow
	* Grant access to a private voice channel, which adds permission to the voice channel for the @mention to connect. The person that will then be allowed into the voice channel is granted the ability to view and connect to the channel. Note: You must be the private voice channel creator in order to do this.

<p align="center">
	Command Usage Example:
	<br><br>
	<img src="readmeImages/allow.png">
	<br><br>
	Permission Changes:
	<br><br>
	<img src="readmeImages/allowPerms.png">
</p>

* Currency
	* Get current currency exchange information, formatted as "-currency[from code][to code][price]". Use -currencycodes for a list of codes.

<p align="center">
	Currency Codes:
	<br><br>
	<img src="readmeImages/currencyCodes.png">
	<br><br>
	Example Usage:
	<br><br>
	<img src="readmeImages/currencyUsage.png">
</p>

* Date
	* Displays the current date.

<p align="center">
	Example Usage:
	<br><br>
	<img src="readmeImages/date.png">
</p>

* Help
	* Open the help dialog to see which commands are available to use.
* How
	* How was this bot created?
* Info
	* Displays information about Matt's server.
* Mute
	* (-m) Mute all in a voice channel (Admins only). See u command for unmuting all in a voice channel.

<p align="center">
	What Happens:
	<br><br>
	<img src="readmeImages/mute.png">
</p>

* Minecraft
	* Displays Matt's Minecraft server information. You can easily replace this server link yourself.
* Movie
	* Displays information about any movie. Use underscores (_) for spaces in movie titles.

<p align="center">
	Example Usage:
	<br><br>
	<img src="readmeImages/movie.png">
</p>

* Time
	* Displays the current time.
* Random
	* Generate a random number using the following scheme: "-random(min,max)int". Use "int" for integer, or "double" for decimal number.

<p align="center">
	Example Usage:
	<br><br>
	<img src="readmeImages/random.png">
</p>

* Remove
	* Remove connection permission from the @mention to the private voice channel, and disconnect from the voice channel if they are currently in it. Note: You must be the private voice channel owner in order to do this. Command usage is the same as the allow command.
* Rename
	* Rename any voice channel within our friend group's channels. Granting the edit permission to the role would also allow creation and deletion of channels, so this was the best option for renaming. Use -rename[old channel name]-[new channel name]
* Stock
	* Gets stock info for a given symbol. Use -stockinfo to get the info you want; be sure to follow the format -stock[symbol]:[info] without the brackets.

<p align="center">
	Example Usage:
	<br><br>
	<img src="readmeImages/stock.png">
</p>

* Unmute
	* (-u) Unmute all in a voice channel (Admins only).

<p align="center">
	What Happens:
	<br><br>
	<img src="readmeImages/unmute.png">
</p>

* Uptime
	* Gets my uptime.
* Weather
	* Get weather for any zip code, for example, "-weather10001" will show the weather for New York City.

<p align="center">
	What Happens:
	<br><br>
	<img src="readmeImages/weather.png">
</p>

* Website
	* View Matthew Vandenberg's website.
<br>  
The possibilities are endless! I use Heroku to host my bot, so that when I make a change to my bot.js file and commit the changes to GitHub, it will automatically restart to bot to reflect the new changes!
