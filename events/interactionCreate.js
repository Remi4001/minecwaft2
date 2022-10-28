const { ownerId } = require('../config.json');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(
            interaction.commandName);

        if (!command) {
            console.error(
                `No command matching ${interaction.commandName} was found.`);
            return;
        }

        if (command.logUser) {
            console.log(interaction.user);
            console.log(interaction.commandName);
        }

        if (command.ownerOnly && interaction.user.id !== ownerId) {
            await interaction.reply({
                content: 'Nope! You can\'t do that!',
                ephemeral: true,
            });
            return;
        }

        if (interaction.client.commands.cooldowns.has(command.name)) {
            await interaction.reply({
                content: `You must wait ${command.cooldown / 1000}
                seconds before executing this command again!`,
                ephemeral: true,
            });
            return;
        }

        if (command.cooldown) {
            interaction.client.commands.cooldowns.add(command.name);
            setTimeout(() => {
                interaction.client.commands.cooldowns.delete(command.name);
            }, command.cooldown);
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: 'There was an error while executing this command!',
                ephemeral: true,
            });
        }
    },
};