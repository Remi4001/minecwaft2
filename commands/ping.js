const { SlashCommandBuilder } = require('discord.js');
const mcHermes = require('mc-hermes');
const { mcType, mcIP, mcPort } = require('./config.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Shows the status of a Minecraft server'),
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