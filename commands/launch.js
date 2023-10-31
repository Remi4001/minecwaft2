const { SlashCommandBuilder } = require('discord.js');
const util = require('util');
const mcHermes = require('mc-hermes');
const path = require('node:path');
const execFile = util.promisify(require('child_process').execFile);
const { launch, interval } = require('../config.json');
const { parseStatus } = require('../functions/updateBot');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('launch')
        .setNameLocalizations({
            fr: 'lancer',
        })
        .setDescription('Launch a Minecraft server')
        .setDescriptionLocalizations({
            fr: 'Lancer un serveur Minecraft',
        })
        .addStringOption(option =>
            option
                .setName('server')
                .setNameLocalizations({
                    fr: 'serveur',
                })
                .setDescription('The server to launch')
                .setDescriptionLocalizations({
                    fr: 'Le serveur à lancer',
                })
                .setRequired(true)
                .setAutocomplete(true),
        ),
    logUser: true,
    cooldown: 10000,
    /**
     * @param {import('discord.js').ChatInputCommandInteraction} interaction
     * Slash command from Discord user
     */
    async execute(interaction) {
        const serverName = interaction.options.getString('server');
        if (!Object.prototype.hasOwnProperty.call(launch, serverName)) {
            return interaction.reply({
                content: `No server matching name \`${serverName}\` found!`,
            });
        }

        await interaction.deferReply();
        const launchPath = path.join(path.dirname(__dirname), 'launch_scripts');
        const { type, ip, port, script } = launch[serverName];

        mcHermes({
            type: type,
            server: ip,
            port: port,
        })
            .catch(console.error)
            .then((data) => {
                if (data) {
                    return interaction.editReply({
                        content: `Server \`${serverName}\` already running!`,
                    });
                }
                execFile(path.join(launchPath, script), { timeout: 5000 })
                    .then(({ stdout, stderr }) => {
                        console.log(`stdout: '${stdout}'`);
                        console.error(`stderr: '${stderr}'`);
                        return interaction.editReply({
                            content: `Starting \`${serverName}\` server...`,
                        });
                    })
                    .then(replyWhenOnline)
                    .catch((error) => {
                        console.error(error);
                        interaction.editReply({
                            content: `Error while starting \`${serverName}\` ` +
                                'server!',
                        });
                    });
            });

        /**
         * Checks if the launched server is online.
         * If yes, sends a message to notify users.
         * Else, do a setTimeout on itself to recheck later.
         * @param {import('discord.js').Message} message
         * The initial message sent by the bot
         */
        function replyWhenOnline(message) {
            mcHermes({
                type: type,
                server: ip,
                port: port,
            })
                // Ignore errors from mcHermes
                // eslint-disable-next-line no-empty-function
                .catch(() => { })
                .then((data2) => {
                    if (parseStatus(data2)[1] === 'online') {
                        return message.reply({
                            content: `Server \`${serverName}\` ` +
                                'online!',
                        });
                    } else {
                        setTimeout(() => replyWhenOnline(message),
                            interval);
                    }
                });
        }
    },
    /**
     * @param {import('discord.js').AutocompleteInteraction} interaction
     * Slash command from Discord user
     */
    async autocomplete(interaction) {
        const focusedValue = interaction.options.getFocused();
        const choices = Object.keys(launch);
        const filtered = choices.filter(choice => choice
            .startsWith(focusedValue));
        await interaction.respond(
            filtered.map(choice => ({ name: choice, value: choice })),
        );
    },
};
