const { ActivityType } = require('discord.js');

/**
 * Updates the status of the discord bot
 * @param {import('discord.js').Client} client Discord client
 * @param {string} activity New activity name
 * @param {import('discord.js').PresenceStatusData} status Discord status
 * @param {boolean} force Force the update
 */
module.exports = function updateStatus(
    client,
    activity,
    status,
    force = false) {
    const cActivity = client.user.presence.activities[0]?.name;
    const cStatus = client.user.presence.status;

    const diffActivity = activity !== cActivity;
    const diffStatus = status !== cStatus;

    // if current status is different
    if (diffActivity || diffStatus || force) {
        setStatus(client, activity, status, cActivity, cStatus);
    }
};

/**
 * @param {import('discord.js').Client} client Discord client
 * @param {string} activity new acivity name
 * @param {import('discord.js').PresenceStatusData} status Discord status
 * @param {string} cActivity current acivity name
 * @param {import('discord.js').PresenceStatus} cStatus current status
 */
function setStatus(client, activity, status, cActivity, cStatus) {
    client.user.setPresence({
        activities: [{
            name: activity,
            state: activity,
            type: ActivityType.Custom,
        }],
        status,
    });
    console.log(`OldStatus: ${cActivity}, ${cStatus}\t` +
        `NewStatus: ${activity}, ${status}`);
}
