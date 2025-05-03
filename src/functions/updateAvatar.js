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
    let base64Headers = '';
    if (icon) {
        let base64Image;
        [base64Headers, base64Image] = icon.split(',');

        iconBuf = await sharp(Buffer.from(base64Image, 'base64'))
            .resize(AVATAR_SIZE, AVATAR_SIZE, { kernel: sharp.kernel.nearest })
            .toBuffer();
    }

    return getBotAvatar(client)
        .then(async (oldAvatar) => {
            const avatarChanged =
                iconBuf && !(oldAvatar && iconBuf.equals(oldAvatar));
            if (avatarChanged || force) {
                // keep null or set new icon in base64
                icon &&= `${base64Headers},${iconBuf.toString('base64')}`;
                return client.user
                    .setAvatar(icon)
                    .then(() => console.log('New avatar set!'));
            }
        })
        .catch(console.error);
};

/**
 * Get the current avatar of the discord bot
 * @param   {import('discord.js').Client} client Discord client
 * @returns {Promise<Buffer|null>}
 * Image, or false when the avatar was either the same or is default
 */
function getBotAvatar(client) {
    const avatarURL = client.user.displayAvatarURL({
        extension: 'png',
        forceStatic: true,
        size: AVATAR_SIZE,
    });

    if (avatarURL.includes('/embed/')) {
        return Promise.resolve(null);
    } else if (getBotAvatar.prototype.oldURL === avatarURL) {
        return Promise.resolve(getBotAvatar.prototype.lastAvatar);
    }

    // get bot's avatar using URL
    return new Promise((resolve, reject) => {
        https.get(avatarURL, (res) => {
            const data = [];

            res.on('data', (chunk) => {
                data.push(chunk);
            });
            res.on('end', () => {
                getBotAvatar.prototype.lastAvatar = Buffer.concat(data);
                getBotAvatar.prototype.oldURL = avatarURL;
                resolve(getBotAvatar.prototype.lastAvatar);
            });
            res.on('error', (error) => {
                reject(error);
            });
        });
    });
}
