/**
 * Updates the status of the discord bot
 * @param {import('discord.js').Client} client Discord client
 * @param {string} activity New activity name
 * @param {import('discord.js').PresenceStatus} status Discord status
 * @param {boolean} force Force the update
 */
module.exports = function updateStatus(client, activity, status, force = false) {
    // If no current status
    if (!client.user.presence.activities[0] || force) {
        client.user.setPresence({ activities: [{ name: activity }], status: status });
        console.log(`OldStatus: ${null}\tNewStatus: ${activity}, ${status}`);
        return;
    }

    const cActivity = client.user.presence.activities[0].name;
    const cStatus = client.user.presence.status;

    const diffActivity = activity !== cActivity;
    const diffStatus = status !== cStatus;

    // if current status is different
    if (diffActivity || diffStatus) {
        client.user.setPresence({ activities: [{ name: activity }], status: status });
        console.log(`OldStatus: ${cActivity}, ${cStatus}\tNewStatus: ${activity}, ${status}`);
    }
};