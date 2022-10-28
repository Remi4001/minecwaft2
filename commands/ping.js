const { SlashCommandBuilder } = require('discord.js');
const mcHermes = require('mc-hermes');
const { mcType, mcIP, mcPort } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Shows the status of a Minecraft server')
        .addSubcommand(subcommand =>
            subcommand
                .setName('default')
                .setDescription('Shows the status of the Minecraft server'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('server')
                .setDescription('Shows the status of a specified Minecraft server')
                .addStringOption(option =>
                    option.setName('type')
                        .setDescription('The type of Minecraft server')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Java', value: 'pc' },
                            { name: 'Bedrock', value: 'pe' },
                        ))
                .addStringOption(option =>
                    option.setName('adress')
                        .setDescription('The adress of the server')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('option')
                        .setDescription('Extra options')
                        .addChoices(
                            { name: 'playerlist', value: 'list' },
                            { name: 'modlist', value: 'modlist' },
                        )),
        ),
    async execute(interaction) {
        // TODO
        if (interaction.options.getSubcommand() === 'default') {
            await interaction.deferReply();
            mcHermes({
                type: mcType,
                server: mcIP,
                port: mcPort,
            })
                .catch(async (error) => {
                    console.warn(error);
                    return await interaction.editReply({
                        content: 'Error while pinging!',
                        ephemeral: true,
                    });
                })
                .then(async (data) => {
                    if (!data) {
                        return await interaction.editReply({
                            content: 'Impossible to reach the server!',
                        });
                    }

                    if (!data.players) {
                        return await interaction.editReply({
                            content: 'Server starting...',
                        });
                    }

                    let msg = new String;

                    if (data.modinfo) msg = 'Modded';
                    else msg = 'Vanilla';

                    return await interaction.editReply({
                        content: `${data.players.online}/${data.players.max} ` +
                        `connected | ${data.version.name} ${msg}`,
                    });
                });
        } else if (interaction.options.getSubcommand() === 'server') {
            // TODO
        }
    },
};