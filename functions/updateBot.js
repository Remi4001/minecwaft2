const mcHermes = require('mc-hermes');
const https = require('https');
const { mcType, mcIP, mcPort } = require('../config.json');

module.exports = async function updateBot(client) {
    await mcHermes({
        type: mcType,
        server: mcIP,
        port: mcPort,
    })
        .catch(console.error)
        .then(async (data) => {
            await ProcessData(data);
        });
    return;

    async function UpdateAvatar(avatar) {
        getBotAvatar()
            .then(async oldAvatar => {
                if (avatar && avatar !== oldAvatar) {
                    await client.user.setAvatar(avatar)
                        .then(console.log('New avatar set!'))
                        .catch(console.error);
                }
            });

        function getBotAvatar() {
            return new Promise((resolve, reject) => {
                const avatarURL = client.user.displayAvatarURL({ extension: 'png', forceStatic: true });

                if (!avatarURL) {
                    resolve(null);
                }

                https.get(avatarURL, (res) => {
                    const data = [];

                    res
                        .on('data', (chunk) => {
                            data.push(chunk);
                        })
                        .on('end', () => {
                            resolve('data:' + res.headers['content-type'] + ';base64,' + new Buffer.concat(data).toString('base64'));
                        })
                        .on('error', (error) => {
                            reject(error);
                        });
                });
            });
        }
    }

    async function UpdateStatus(activity, status) {
        if (!client.user.presence.activities[0]) {
            await client.user.setPresence({ activities: [{ name: activity }], status: status });
            console.log(`OldStatus: ${null}\tNewStatus: ${activity}, ${status}`);
            return;
        }

        const cActivity = client.user.presence.activities[0].name;
        const cStatus = client.user.presence.status;

        const diffActivity = activity !== cActivity;
        const diffStatus = status !== cStatus;

        if (diffActivity || diffStatus) {
            await client.user.setPresence({ activities: [{ name: activity }], status: status });
            console.log(`OldStatus: ${cActivity}, ${cStatus}\tNewStatus: ${activity}, ${status}`);
        }
        return;
    }

    async function ProcessData(data) {
        if (!data) {
            // If the server is unreachable (we assume offline)
            await UpdateStatus('Server offline', 'dnd');
            return;
        }

        if (!data.players) {
            // If the server is currently booting
            await UpdateStatus('Server booting...', 'idle');
            return;
        }

        let activity = data.players.online + '/' + data.players.max + ' connected ';

        // Verify if forge mods are present
        if (!data.modinfo) {
            activity += data.version.name + ' Vanilla';
        } else {
            activity += data.version.name + ' Modded';
        }
        await UpdateStatus(activity, 'online');

        // Update the bot's avatar with the server's icon
        await UpdateAvatar(data?.favicon.replace(/\r?\n|\r/g, ''));

        return;
    }
};