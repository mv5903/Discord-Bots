## Welcome to My All-Purpose Discord Bot  

#### Using this bot, you can make it perform a wide variety of tasks! Here are a list of commands that I have implemented for my Discord bot:  

<br>

* -allow
	* Grant access to a private voice channel, which adds permission to the voice channel for the @mention to connect. The person that will then be allowed into the voice channel is granted the ability to view and connect to the channel. Note: You must be the private voice channel creator in order to do this.

<p align="center">
	Command Usage Example:
	<img src="readmeImages/allow.png">
	<br>
	<br>
	Permission Changes:
	<img src="readmeImages/allowPerms.png">
</p>

* -currency
	* Get current currency exchange information, formatted as "-currency[from code][to code][price]", example: "-currencyUSDCAD10.68" Use -currencycodes for a list of codes.
* -date
	* Displays the current date.
* -help
	* Open this help message again.
* -how
	* How was this bot created?
* -info
	* Displays information about the Kwikmatt Server.
* -m
	* Mute all in a voice channel (Admins only).
* -minecraft
	* Displays the kwikmatt Minecraft server information.
* -time
	* Displays the current time.
* -random
	* Generate a random number using the following scheme: "-random(min,max)int". Use "int" for integer, or "double" for decimal number.
* -remove
	* Remove connection permission from the @mention to the private voice channel, and disconnect from the voice channel if they are currently in it. Note: You must be the private voice channel owner in order to do this.
* -rename
	* Rename any voice channel within our friend group's channels. Granting the edit permission to the role would also allow creation and deletion of channels, so this was the best option for renaming.
* -stock
	* Gets stock info for a given symbol. Use -stockinfo to get the info you want; be sure to follow the format -stock[symbol]:[info] without the brackets.
* -u
	* Unmute all in a voice channel (Admins only).
* -uptime
	* Gets my uptime.
* -weather
	* Get weather for any zip code, for example, "-weather10001" will show the weather for New York City.
* -website
	* View Matthew Vandenberg's website.
<br>  
The possibilities are endless! I use Heroku to host my bot, so that when I make a change to my bot.js file and commit the changes to GitHub, it will automatically restart to bot to reflect the new changes!
