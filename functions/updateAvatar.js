const https = require('https');

/**
 * Updates the avatar of the discord bot to be the server's icon
 * @param {import('discord.js').Client} client Discord client
 * @param {string} icon Minecraft server icon
 * @param {boolean} force Forces the avatar to be updated
 */
module.exports = function updateAvatar(client, icon, force = false) {
    getBotAvatar(client)
        .then(async oldAvatar => {
            if ((icon !== oldAvatar && icon && oldAvatar) || force) {
                client.user.setAvatar(icon)
                    .then(console.log('New avatar set!'))
                    .catch(console.error);
            }
        })
        .catch(console.error);
};

/**
 * Get the current avatar of the discord bot
 * @param   {import('discord.js').Client} client Discord client
 * @returns {Promise<string|false>} Image, or false when the avatar was either the same or is default
 */
function getBotAvatar(client) {
    const avatarURL = client.user.displayAvatarURL({
        extension: 'png',
        forceStatic: true,
    });

    if (avatarURL.includes('/embed/') || getBotAvatar.prototype.oldURL === avatarURL) {
        return Promise.resolve(false);
    } else {
        getBotAvatar.prototype.oldURL = avatarURL;
    }

    // get bot's avatar using URL
    return new Promise((resolve, reject) => {
        https.get(avatarURL, (res) => {
            const data = [];

            res.on('data', (chunk) => {
                data.push(chunk);
            });
            res.on('end', () => {
                resolve('data:' +
                    res.headers['content-type'] +
                    ';base64,' +
                    new Buffer.concat(data).toString('base64'));
            });
            res.on('error', (error) => {
                reject(error);
            });
        });
    });
}