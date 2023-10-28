const { ownerId } = require('../config.json');

module.exports = {
    name: 'interactionCreate',
    /**
     * @param {import('discord.js').Interaction} interaction
     * Slash command from Discord user
     */
    execute(interaction) {
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(
                interaction.commandName);

            if (!command) {
                console.error(
                    `No command matching ${interaction.commandName} was ` +
                    'found.');
                return;
            }

            if (command.logUser) {
                console.log(interaction.user);
                console.log(interaction.commandName);
            }

            if (command.ownerOnly && interaction.user.id !== ownerId) {
                return interaction.reply({
                    content: 'Nope! You can\'t do that!',
                    ephemeral: true,
                });
            }

            if (interaction.client.commands.cooldowns.has(command.name)) {
                return interaction.reply({
                    content: 'Be patient! This command has a ' +
                        `${command.cooldown / 1000} seconds cooldown!`,
                    ephemeral: true,
                });
            } else if (command.cooldown) {
                interaction.client.commands.cooldowns.add(command.name);
                setTimeout(() => {
                    interaction.client.commands.cooldowns.delete(command.name);
                }, command.cooldown);
            }

            command.execute(interaction)
                .catch((error) => {
                    console.error(error);
                    interaction.reply({
                        content: 'There was an error while executing this ' +
                            'command!',
                        ephemeral: true,
                    });
                });
        } else if (interaction.isAutocomplete()) {
            const command = interaction.client.commands
                .get(interaction.commandName);

            if (!command) {
                console.error(`No command matching ${interaction.commandName}` +
                    ' was found.');
                return;
            }

            command.autocomplete(interaction)
                .catch(console.error);
        }
    },
};