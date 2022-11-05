const https = require('https');

module.exports = function updateAvatar(client, avatar, force = false) {
    getBotAvatar()
        .then(async oldAvatar => {
            if (avatar !== oldAvatar || force) {
                client.user.setAvatar(avatar)
                    .then(console.log('New avatar set!'))
                    .catch(console.error);
            }
        })
        .catch(console.error);

    function getBotAvatar() {
        // construct URL based on the Minecraft server's icon
        const avatarURL = client.user.displayAvatarURL({
            extension: 'png',
            forceStatic: true,
        });

        if (avatarURL.includes('/embed/')) {
            return Promise.resolve(null);
        }

        // get bot's avatar using URL
        return new Promise((resolve, reject) => {
            https.get(avatarURL, (res) => {
                const data = [];

                res
                    .on('data', (chunk) => {
                        data.push(chunk);
                    })
                    .on('end', () => {
                        resolve('data:' +
                            res.headers['content-type'] +
                            ';base64,' +
                            new Buffer.concat(data).toString('base64'));
                    })
                    .on('error', (error) => {
                        reject(error);
                    });
            });
        });
    }
};