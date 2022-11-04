const { updateBot } = require('../functions/updateBot.js');
const { interval } = require('../config.json');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        updateBot(client);
        console.log(`Ready! Logged in as ${client.user.tag}`);
        setInterval(updateBot, interval, client);
    },
};