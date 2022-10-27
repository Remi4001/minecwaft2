// const { interval } = require('./config.json');

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`Ready! Logged in as ${client.user.tag}`);
        // TODO: updateBot(); setInterval(updateBot, interval);
    },
};