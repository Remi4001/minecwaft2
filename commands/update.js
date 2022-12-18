const { SlashCommandBuilder } = require('discord.js');
const mcHermes = require('mc-hermes');
const updateAvatar = require('../functions/updateAvatar.js');
const updateStatus = require('../functions/updateStatus.js');
const { parseAvatar, parseStatus } = require('../functions/updateBot.js');
const { type, ip, port } = require('../config.json').server;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('update')
        .setNameLocalizations({
            fr: 'maj',
        })
        .setDescription('Updates the bot\'s appearance on Discord')
        .setDescriptionLocalizations({
            fr: 'Met à jour l\'apparence du bot sur Discord',
        })
        .addSubcommand(subcommand =>
            subcommand
                .setName('avatar')
                .setNameLocalizations({
                    fr: 'avatar',
                })
                .setDescription('Manually changes the bot\'s avatar to the Minecraft server\'s icon')
                .setDescriptionLocalizations({
                    fr: 'Remplace manuellement l\'avatar du bot par l\'ic\u00f4ne du serveur Minecraft',
                }))
        .addSubcommand(subcommand =>
            subcommand
                .setName('status')
                .setNameLocalizations({
                    fr: 'statut',
                })
                .setDescription('Manually updates the bot\'s status on Discord')
                .setDescriptionLocalizations({
                    fr: 'Met à jour manuellement le statut du bot sur Discord',
                })),
    cooldown: 60000,
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        mcHermes({
            type: type,
            server: ip,
            port: port,
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
                                return await interaction.editReply({
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