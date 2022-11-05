const { SlashCommandBuilder } = require('discord.js');
const mcHermes = require('mc-hermes');
const { type, ip, port } = require('../config.json').server;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Shows the status of a Minecraft server')
        .addSubcommand(subcommand =>
            subcommand
                .setName('default')
                .setDescription('Shows the status of the Minecraft server')
                .addStringOption(option =>
                    option.setName('option')
                        .setDescription('Extra options')
                        .addChoices(
                            { name: 'playerlist', value: 'list' },
                            { name: 'modlist', value: 'modlist' },
                        )),
        )
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
                        .setDescription('The adress of the server <ip:port>')
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
        await interaction.deferReply();
        // TODO: locale
        if (interaction.options.getSubcommand() === 'default') {
            mcHermes({
                type: type,
                server: ip,
                port: port,
            })
                .catch(console.error)
                .then(async (data) => await reply(data));
        } else if (interaction.options.getSubcommand() === 'server') {
            const adress = interaction.options.getString('adress').split(':', 2);

            mcHermes({
                type: interaction.options.getString('type'),
                server: adress[0],
                port: adress[1],
            })
                .catch(console.error)
                .then(async (data) => await reply(data));
        }

        async function reply(data) {
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

            const option = interaction.options.getString('option');
            let msg = new String;

            switch (option) {
                case 'list':
                    if (!data.players.sample) {
                        msg = 'No players online';
                    } else if (data.players.sample.length) {
                        msg = 'Players connected:';
                        for (let i = 0; i < data.players.sample.length; i++) {
                            msg += `\n- ${data.players.sample[i].name}`;
                        }
                    } else {
                        msg = 'Player list inaccessible';
                    }
                    break;
                case 'modlist':
                    if (data.modinfo) {
                        msg = 'Mods present on the server:';
                        for (let i = 0; i < data.modinfo.modList.length; i++) {
                            const modinfo = `- ${data.modinfo.modList[i].modid}` +
                                ` ${data.modinfo.modList[i].version}`;

                            if (msg.length + modinfo.length > 2000) {
                                await interaction.followUp({
                                    content: msg,
                                });
                                msg = modinfo;
                            } else {
                                msg += '\n' + modinfo;
                            }
                        }
                    } else {
                        msg = 'No mods detected on the server';
                    }
                    break;
                default:
                    if (data.modinfo) msg = 'Modded';
                    else msg = 'Vanilla';

                    msg = `${data.players.online}/${data.players.max} ` +
                        `connected | ${data.version.name} ${msg}`;
            }
            return await interaction.followUp({
                content: msg,
            });
        }
    },
};