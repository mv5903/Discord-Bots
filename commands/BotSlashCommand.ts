import { SlashCommandBuilder } from "discord.js";

export abstract class BotSlashCommand {
    public name: string;
    public description: string;

    constructor(name: string, description: string) {
        this.name = name;
        this.description = description;
    }

    /**
     * Gets the slash command object. This is used by the Discord API to register the command.
     * Please use either {@link SlashCommandBuilder} or follow the format of the example below:
     * {
     *    name: 'command-name',
     *    description: 'Command description',
     * }
     * @returns {Object} The slash command object to pass to the Discord API
     */
    abstract getSlashCommand() : any;

    /**
     * Function to run when a command is executed.
     * @param interaction The interaction object from Discord, fired when the command is used
     */
    abstract execute(interaction: any) : void;
}