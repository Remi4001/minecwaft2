const { SlashCommandBuilder } = require('discord.js');
const mcHermes = require('mc-hermes');
const updateAvatar = require('../functions/updateAvatar.js');
const updateStatus = require('../functions/updateStatus.js');
const { parseIcon: parseAvatar, parseStatus } =
    require('../functions/updateBot.js');
const { type, ip, port } = require('../../config.json').server;
const getString = require('../i18n/i18n');

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
        .addSubcommand(subcommand => subcommand
            .setName('avatar')
            .setNameLocalizations({
                fr: 'avatar',
            })
            .setDescription('Manually changes the bot\'s avatar to the ' +
                'Minecraft server\'s icon')
            .setDescriptionLocalizations({
                fr: 'Remplace manuellement l\'avatar du bot par ' +
                    'l\'ic\u00f4ne du serveur Minecraft',
            }))
        .addSubcommand(subcommand => subcommand
            .setName('status')
            .setNameLocalizations({
                fr: 'statut',
            })
            .setDescription('Manually updates the bot\'s status on Discord')
            .setDescriptionLocalizations({
                fr: 'Met à jour manuellement le statut du bot sur Discord',
            })),
    cooldown: 60000,
    /**
     * @param {import('discord.js').ChatInputCommandInteraction} interaction
     * Slash command from Discord user
     */
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        mcHermes({ type, server: ip, port })
            .catch(console.error)
            .then(async data => {
                switch (interaction.options.getSubcommand()) {
                    case 'avatar':
                        // Update the bot's avatar with the server's icon
                        await updateAvatar(
                            interaction.client,
                            parseAvatar(data),
                            true,
                        );
                        interaction.editReply({
                            content: await
                            getString(interaction.locale, 'newAvatar'),
                        });
                        break;
                    case 'status':
                        // Update the bot's status
                        updateStatus(
                            interaction.client,
                            ...parseStatus(data),
                            true,
                        );
                        interaction.editReply({
                            content: await
                            getString(interaction.locale, 'newStatus'),
                        });
                        break;
                }
            });
    },
};
