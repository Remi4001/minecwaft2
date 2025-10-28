const { updateBot, parseStatus } = require('../functions/updateBot.js');
const { interval, server } = require('../../config.json');
const { type, ip, port } = server;
const mcHermes = require('mc-hermes');
const updateStatus = require('../functions/updateStatus.js');

module.exports = {
    once: true,
    /**
     * @param {import('discord.js').Client} client Discord bot
     */
    execute(client) {
        updateBot(client);
        console.log(`Ready! Logged in as ${client.user.tag}`);
        this.interval = setInterval(updateBot, interval, client);

        // update status on reconnection
        client.on('shardReady', () => {
            mcHermes({ type, server: ip, port })
                .catch(console.error)
                .then(data => updateStatus(client, ...parseStatus(data), true));
        });
    },
};
