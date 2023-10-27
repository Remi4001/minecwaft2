const mcHermes = require('mc-hermes');
const updateAvatar = require('./updateAvatar.js');
const updateStatus = require('./updateStatus.js');
const { type, ip, port } = require('../config.json').server;

let lastError;

module.exports = {
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
                module.exports.parseStatus(data)
                    .then((status) =>
                        updateStatus(client, status[0], status[1]));

                // Update the bot's avatar with the server's icon
                module.exports.parseIcon(data)
                    .then((icon) =>
                        updateAvatar(client, icon));

                return;
            });
    },
    parseStatus(data) {
        if (!data) {
            // If the server is unreachable (we assume offline)
            return Promise.resolve(['Server offline', 'dnd']);
        }

        if (!data.players) {
            // If the server is currently booting
            return Promise.resolve(['Server booting...', 'idle']);
        }

        let activity = data.players.online + '/' + data.players.max + ' connected ';

        // Verify if forge mods are present
        if (!data.modinfo) {
            activity += data.version.name + ' Vanilla';
        } else {
            activity += data.version.name + ' Modded';
        }
        return Promise.resolve([activity, 'online']);
    },
    parseIcon(data) {
        return Promise.resolve(data?.favicon?.replace(/\r?\n|\r/g, '') ?? null);
    },
};
