const { updateBot } = require('../functions/updateBot.js');
const { interval } = require('../../config.json');

module.exports = {
    name: 'ready',
    once: true,
    /**
     * @param {import('discord.js').Client} client Discord bot
     */
    execute(client) {
        updateBot(client);
        console.log(`Ready! Logged in as ${client.user.tag}`);
        this.interval = setInterval(updateBot, interval, client);
    },
};
