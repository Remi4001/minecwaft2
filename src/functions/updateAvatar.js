const https = require('https');
const sharp = require('sharp');

const AVATAR_SIZE = 256;

/**
 * Updates the avatar of the discord bot to be the server's icon
 * @param {import('discord.js').Client} client Discord client
 * @param {?string} icon Minecraft server icon as base64
 * @param {boolean} force Forces the avatar to be updated
 * @returns {Promise<void>} promise resolved when the new avatar is set
 */
module.exports = async function updateAvatar(client, icon, force = false) {
    /** @type {Buffer} */
    let iconBuf = null;
    if (icon && !icon.startsWith('data:')) {
        return Promise.resolve();
    } else if (icon) {
        iconBuf = await sharp(Buffer.from(icon.split(',')[1], 'base64'))
            .resize(AVATAR_SIZE, AVATAR_SIZE, { kernel: sharp.kernel.nearest })
            .toBuffer();
    }
    return getBotAvatar(client)
        .then(async oldAvatar => {
            if (iconBuf && !(oldAvatar && iconBuf.equals(oldAvatar)) || force) {
                return client.user.setAvatar(
                    icon.split(',')[0] + ',' + iconBuf.toString('base64'),
                )
                    .then(() => console.log('New avatar set!'));
            }
        })
        .catch(console.error);
};

/**
 * Get the current avatar of the discord bot
 * @param   {import('discord.js').Client} client Discord client
 * @returns {Promise<Buffer|undefined>}
 * Image, or false when the avatar was either the same or is default
 */
function getBotAvatar(client) {
    const avatarURL = client.user.displayAvatarURL({
        extension: 'png',
        forceStatic: true,
        size: AVATAR_SIZE,
    });

    if (avatarURL.includes('/embed/') ||
        getBotAvatar.prototype.oldURL === avatarURL) {
        return Promise.resolve(getBotAvatar.prototype.lastAvatar);
    } else {
        getBotAvatar.prototype.oldURL = avatarURL;
    }

    // get bot's avatar using URL
    return new Promise((resolve, reject) => {
        https.get(avatarURL, res => {
            const data = [];

            res.on('data', chunk => {
                data.push(chunk);
            });
            res.on('end', () => {
                getBotAvatar.prototype.lastAvatar = Buffer.concat(data);
                resolve(getBotAvatar.prototype.lastAvatar);
            });
            res.on('error', error => {
                reject(error);
            });
        });
    });
}
