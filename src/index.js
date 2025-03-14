// Require the necessary discord.js classes
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { token } = require('../config.json');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Collection used to store and efficiently retrieve commands for execution
client.commands = new Collection();
// Set for handling commands cooldowns
client.commands.cooldowns = new Set();

// Import commands from the commands/ folder
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath)
    .filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    /*
     * Set a new item in the Collection with the key as the command name and
     * the value as the exported module
     */
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a ` +
            'required "data" or "execute" property.');
    }
}

// Import events from the events/ folder
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath)
    .filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

// Log in to Discord with your client's token
client.login(token);

/**
 * Disconnects the bot properly and clears the event loop.
 */
function shutdown() {
    console.log('Shutting down...');
    client.destroy();
    clearInterval(require('./events/ready').interval);
    clearTimeout(require('./commands/launch').timeout);
    Object.values(require('./events/interactionCreate').interval)
        .forEach(timeout => { clearTimeout(timeout); });
}
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
