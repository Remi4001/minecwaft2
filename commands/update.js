const { SlashCommandBuilder } = require('discord.js');
const mcHermes = require('mc-hermes');
const updateAvatar = require('../functions/updateAvatar.js');
const updateStatus = require('../functions/updateStatus.js');
const { parseAvatar, parseStatus } = require('../functions/updateBot.js');
const { mcType, mcIP, mcPort } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('update')
        .setDescription('Updates the bot\'s appearance on Discord')
        .addSubcommand(subcommand =>
            subcommand
                .setName('avatar')
                .setDescription('Manually changes the bot\'s avatar to the ' +
                    'Minecraft server\'s icon'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('status')
                .setDescription('Manually updates the bot\'s status')),
    cooldown: 60000,
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        mcHermes({
            type: mcType,
            server: mcIP,
            port: mcPort,
        })
            .catch(console.error)
            .then(async data => {
                switch (interaction.options.getSubcommand()) {
                    case 'avatar':
                        // Update the bot's avatar with the server's icon
                        parseAvatar(data)
                            .then(async (avatar) => {
                                updateAvatar(
                                    interaction.client,
                                    avatar,
                                    true,
                                );
                                await interaction.editReply({
                                    content: 'New avatar set!',
                                    ephemeral: true,
                                });
                            });
                        break;
                    case 'status':
                        // Update the bot's status
                        parseStatus(data)
                            .then(async (status) => {
                                updateStatus(
                                    interaction.client,
                                    status[0],
                                    status[1],
                                    true,
                                );
                                return await interaction.editReply({
                                    content: 'New status set!',
                                    ephemeral: true,
                                });
                            });
                        break;
                }
            });
    },
};