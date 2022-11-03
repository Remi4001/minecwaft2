const mcHermes = require('mc-hermes');
const updateAvatar = require('./updateAvatar.js');
const updateStatus = require('./updateStatus.js');
const { mcType, mcIP, mcPort } = require('../config.json');

module.exports = async function updateBot(client) {
    // ping the Minecraft server
    await mcHermes({
        type: mcType,
        server: mcIP,
        port: mcPort,
    })
        // log errors, but process the data anyway
        .catch(console.error)
        .then(async (data) => {
            await processData(data);
        });
    return;

    async function processData(data) {
        if (!data) {
            // If the server is unreachable (we assume offline)
            await updateStatus(client, 'Server offline', 'dnd');
            return;
        }

        if (!data.players) {
            // If the server is currently booting
            await updateStatus(client, 'Server booting...', 'idle');
            return;
        }

        let activity = data.players.online + '/' + data.players.max + ' connected ';

        // Verify if forge mods are present
        if (!data.modinfo) {
            activity += data.version.name + ' Vanilla';
        } else {
            activity += data.version.name + ' Modded';
        }
        await updateStatus(client, activity, 'online');

        // Update the bot's avatar with the server's icon
        await updateAvatar(client, data.favicon?.replace(/\r?\n|\r/g, '') ?? null);

        return;
    }
};