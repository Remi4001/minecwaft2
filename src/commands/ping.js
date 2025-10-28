const { SlashCommandBuilder } = require('discord.js');
const mcHermes = require('mc-hermes');
const { type, ip, port } = require('../../config.json').server;
const getString = require('../i18n/i18n');

/** @type {import('discord.js').APIApplicationCommandOptionChoice<string>[]} */
const extraOptionChoices = [
    {
        name: 'Player list',
        name_localizations: {
            fr: 'Liste des joueurs',
        },
        value: 'list',
    },
    {
        name: 'Mod list',
        name_localizations: {
            fr: 'Liste des mods',
        },
        value: 'modlist',
    },
    {
        name: 'JSON data',
        name_localizations: {
            fr: 'Données JSON',
        },
        value: 'data',
    },
];

const jsonSpaces = 4;
// ip + port
const maxFieldsInAddress = 2;
const messageMaxLength = 2000;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setNameLocalizations({
            fr: 'ping',
        })
        .setDescription('Shows the status of a Minecraft server')
        .setDescriptionLocalizations({
            fr: "Affiche le status d'un serveur Minecraft",
        })
        .addSubcommand((subcommand) =>
            subcommand
                .setName('default')
                .setNameLocalizations({
                    fr: 'd\u00e9faut',
                })
                .setDescription(
                    'Shows the status of the default Minecraft ' + 'server',
                )
                .setDescriptionLocalizations({
                    fr:
                        'Affiche le statut du serveur Minecraft par ' +
                        'd\u00e9faut',
                })
                .addStringOption((option) => addExtraOption(option)),
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('server')
                .setNameLocalizations({
                    fr: 'serveur',
                })
                .setDescription(
                    'Shows the status of a specified Minecraft ' + 'server',
                )
                .setDescriptionLocalizations({
                    fr:
                        'Affiche le statut du serveur Minecraft ' +
                        'sp\u00e9cifi\u00e9',
                })
                .addStringOption((option) =>
                    option
                        .setName('type')
                        .setNameLocalizations({
                            fr: 'type',
                        })
                        .setDescription('The type of Minecraft server')
                        .setDescriptionLocalizations({
                            fr: 'Le type du serveur Minecraft',
                        })
                        .setRequired(true)
                        .addChoices(
                            { name: 'Java', value: 'pc' },
                            { name: 'Bedrock', value: 'pe' },
                        ),
                )
                .addStringOption((option) =>
                    option
                        .setName('adress')
                        .setNameLocalizations({
                            fr: 'adresse',
                        })
                        .setDescription('The adress of the server <ip:port>')
                        .setDescriptionLocalizations({
                            fr: "L'adresse du serveur <ip:port>",
                        })
                        .setRequired(true),
                )
                .addStringOption((option) => addExtraOption(option)),
        ),
    /**
     * @param {import('discord.js').ChatInputCommandInteraction} interaction
     * Slash command from Discord user
     */
    async execute(interaction) {
        await interaction.deferReply();
        // TODO: locale
        if (interaction.options.getSubcommand() === 'default') {
            mcHermes({ type, server: ip, port })
                .catch(console.error)
                .then((data) => reply(interaction, data));
        } else if (interaction.options.getSubcommand() === 'server') {
            const adress = interaction.options
                .getString('adress')
                .split(':', maxFieldsInAddress);

            mcHermes({
                type: interaction.options.getString('type'),
                server: adress[0],
                port: adress[1],
            })
                .catch(console.error)
                .then((data) => reply(interaction, data));
        }
    },
};

/**
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 * Slash command from Discord user
 * @param {*} data Response from Minecraft server
 * @returns {Promise} Promise resolved when the reply is sent
 */
async function reply(interaction, data) {
    const getStringl = (string, args) =>
        getString(interaction.locale, string, args);
    if (!data) {
        return interaction.editReply({
            content: await getStringl('unreachable'),
        });
    }

    if (!data.players) {
        return interaction.editReply({
            content: await getStringl('starting2'),
        });
    }

    const option = interaction.options.getString('option');
    let msg;

    switch (option) {
        case extraOptionChoices[0].value:
            if (!data.players.sample) {
                msg = await getStringl('noPlayers');
            } else if (data.players.sample.length) {
                msg = await getStringl('players');
                for (let i = 0; i < data.players.sample.length; i++) {
                    msg += `\n- ${data.players.sample[i].name}`;
                }
            } else {
                msg = await getStringl('!players');
            }
            break;
        case extraOptionChoices[1].value:
            if (data.modinfo) {
                msg = await getStringl('mods');
                // TODO: Return text file?
                for (let i = 0; i < data.modinfo.modList.length; i++) {
                    const modinfo =
                        `- ${data.modinfo.modList[i].modid}` +
                        ` ${data.modinfo.modList[i].version}`;

                    if (msg.length + modinfo.length > messageMaxLength) {
                        await interaction.followUp({ content: msg });
                        msg = modinfo;
                    } else {
                        msg += '\n' + modinfo;
                    }
                }
            } else {
                msg = await getStringl('noMods');
            }
            break;
        case extraOptionChoices[2].value:
            return interaction.followUp({
                files: [
                    {
                        attachment: Buffer.from(
                            JSON.stringify(data, undefined, jsonSpaces),
                        ),
                        name: 'data.json',
                    },
                ],
            });
        default:
            msg = await getStringl('ping', {
                pOnline: data.players.online,
                pMax: data.players.max,
                version: data.version.name,
                VorM: await getStringl(data.modinfo ? 'modded' : 'vanilla'),
            });
    }
    return interaction.followUp({ content: msg });
}

/**
 * @param {import('discord.js').SlashCommandStringOption} option
 * Option when building a slash command
 * @returns {import('discord.js').SlashCommandStringOption}
 * The input option with the new extra choices
 */
function addExtraOption(option) {
    return option
        .setName('option')
        .setNameLocalizations({
            fr: 'option',
        })
        .setDescription('Extra options')
        .setDescriptionLocalizations({
            fr: 'Options suppl\u00e9mentaires',
        })
        .addChoices(extraOptionChoices);
}
