const { REST, Routes } = require('discord.js');
// eslint-disable-next-line no-unused-vars
const { clientId, guildId, token } = require('../config.json');
const fs = require('node:fs');
const path = require('node:path');

const commands = [];
// Grab all the command files from the commands directory you created earlier
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands'))
    .filter(file => file.endsWith('.js'));

/*
 * Grab the SlashCommandBuilder#toJSON() output of each command's data for
 * deployment
 */
if (process.argv[2] !== 'delete') {
    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        commands.push(command.data.toJSON());
    }
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(token);

// and deploy your commands!
(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) ` +
            'commands.');

        /*
         * The put method is used to fully refresh all commands in the guild
         * with the current set
         */
        const data = await rest.put(
            /*
             * For deploying commands locally on a specific guild
             * Routes.applicationGuildCommands(clientId, guildId),
             * For deploying commands globally
             */
            Routes.applicationCommands(clientId),
            { body: commands },
        );

        console.log(`Successfully reloaded ${data.length} application (/) ` +
            'commands.');
    } catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error);
    }
})();
