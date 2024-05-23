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
    // If no current status
    if (!client.user.presence.activities[0] || force) {
        setStatus(client, activity, status);
    }

    const cActivity = client.user.presence.activities[0].name;
    const cStatus = client.user.presence.status;

    const diffActivity = activity !== cActivity;
    const diffStatus = status !== cStatus;

    // if current status is different
    if (diffActivity || diffStatus) {
        setStatus(client, activity, status);
    }
};

/**
 * @param {import('discord.js').Client} client Discord client
 * @param {string} activity new acivity name
 * @param {import('discord.js').PresenceStatusData} status Discord status
 */
function setStatus(client, activity, status) {
    client.user.setPresence({
        activities: [{ name: activity }],
        status,
    });
    console.log(`OldStatus: ${null}\tNewStatus: ${activity}, ${status}`);
}
