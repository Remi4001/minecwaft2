const { ownerId } = require('../../config.json');
const getString = require('../i18n/i18n.js');

const msInSecond = 1000;

module.exports = {
    name: 'interactionCreate',
    /**
     * @param {import('discord.js').Interaction} interaction
     * Slash command from Discord user
     * @returns {Promise<any>}
     * Possibly anything, ex: void if there is no corresponding command, the
     * result from executing the command, a Promise<Message>, etc.
     */
    async execute(interaction) {
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(
                interaction.commandName);

            if (!command) {
                return console.error(
                    `No command matching ${interaction.commandName} was ` +
                    'found.');
            }

            if (command.logUser) {
                console.log(interaction.user);
                console.log(interaction.commandName);
            }

            if (command.ownerOnly && interaction.user.id !== ownerId) {
                return interaction.reply({
                    content: await getString(interaction.locale, 'denied'),
                    ephemeral: true,
                });
            }

            if (interaction.client.commands.cooldowns.has(command.data.name)) {
                return interaction.reply({
                    content: await getString(interaction.locale, 'onCooldown',
                        { cooldown: command.cooldown / msInSecond }),
                    ephemeral: true,
                });
            } else if (command.cooldown) {
                interaction.client.commands.cooldowns.add(command.data.name);
                this.interval[command.data.name] = setTimeout(() => {
                    interaction.client.commands.cooldowns.delete(
                        command.data.name);
                }, command.cooldown);
            }

            return command.execute(interaction)
                .catch(async error => {
                    console.error(error);
                    return interaction.reply({
                        content: await getString(interaction.locale,
                            'commandError'),
                        ephemeral: true,
                    });
                });
        } else if (interaction.isAutocomplete()) {
            const command = interaction.client.commands
                .get(interaction.commandName);

            if (!command) {
                return console.error('No command matching ' +
                    `${interaction.commandName} was found.`);
            }

            return command.autocomplete(interaction)
                .catch(console.error);
        }
    },
    interval: {},
};
