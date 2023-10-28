const mcHermes = require('mc-hermes');
const updateAvatar = require('./updateAvatar.js');
const updateStatus = require('./updateStatus.js');
const { type, ip, port } = require('../config.json').server;

let lastError;

module.exports = {
    /**
     * Updates the avatar and status
     * @param {import('discord.js').Client} client Discord client
     */
    updateBot(client) {
        // ping the Minecraft server
        mcHermes({
            type: type,
            server: ip,
            port: port,
        })
            // log errors, but process the data anyway
            .catch(error => {
                if (error.toString() !== lastError) {
                    console.error(error);
                    lastError = error.toString();
                }
            })
            .then((data) => {
                // Update the bot's status
                const status = module.exports.parseStatus(data);
                updateStatus(client, status[0], status[1]);

                // Update the bot's avatar with the server's icon
                updateAvatar(client, module.exports.parseIcon(data));
            });
    },
    /**
     * Parses the data from the Minecraft server to get the Discord bot's status
     * @param {any} data Response from Minecraft server
     * @returns {[string, import('discord.js').PresenceStatus]}
     */
    parseStatus(data) {
        if (!data) {
            // If the server is unreachable (we assume offline)
            return ['Server offline', 'dnd'];
        }

        if (!data.players) {
            // If the server is currently booting
            return ['Server booting...', 'idle'];
        }

        let activity = `${data.players.online}/${data.players.max} connected ` +
            data.version.name + ' ';

        // Verify if forge mods are present
        if (!data.modinfo) {
            activity += 'Vanilla';
        } else {
            activity += 'Modded';
        }
        return [activity, 'online'];
    },
    /**
     * Parses the data from the Minecraft server to get the icon
     * @param {*} data Response from Minecraft server
     * @returns {string} Image
     */
    parseIcon(data) {
        return data?.favicon?.replace(/\r?\n|\r/g, '') ?? null;
    },
};
