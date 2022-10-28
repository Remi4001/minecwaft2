const { SlashCommandBuilder } = require('discord.js');
const mcHermes = require('mc-hermes');
const { mcType, mcIP, mcPort } = require('./config.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Shows the status of the Minecraft server')
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
                .addSubcommand(subsubcommand =>
                    subsubcommand
                        .setName('list')
                        .setDescription('Get the connected players list'))
                .addSubcommand(subsubcommand =>
                    subsubcommand
                        .setName('modlist')
                        .setDescription('List the mods present on the server')),
        ),
    async execute(interaction) {
        // TODO
        if (noArgs) {
            mcHermes({
                type: mcType,
                server: mcIP,
                port: mcPort,
            })
                .catch(async (error) => {
                    console.warn(error);
                    return await interaction.reply({
                        content: 'Error while pinging!',
                        ephemeral: true,
                    });
                })
                .then(async (data) => {
                    if (!data) {
                        return await interaction.reply({
                            content: 'Impossible to reach the server!',
                        });
                    }

                    if (!data.players) {
                        return await interaction.reply({
                            content: 'Server starting...',
                        });
                    }

                    let msg = new String;

                    if (data.modinfo) msg = 'Modded';
                    else msg = 'Vanilla';

                    return await interaction.reply({
                        content: `${data.players.online}/${data.players.max}
                        connected | ${data.version.name} ${msg}`,
                    });
                });
        } else {
            // TODO
        }
    },
};