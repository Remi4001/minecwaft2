const { SlashCommandBuilder } = require('discord.js');
const util = require('util');
const mcHermes = require('mc-hermes');
const path = require('node:path');
const exec = util.promisify(require('child_process').exec);
const { launch } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('launch')
        .setDescription('Launch a Minecraft server')
        .addStringOption(option =>
            option.setName('server')
                .setDescription('The server to launch')
                .setRequired(true)
                .setAutocomplete(true),
        ),
    logUser: true,
    cooldown: 10000,
    async execute(interaction) {
        const serverName = interaction.options.getString('server');
        if (!Object.prototype.hasOwnProperty.call(launch, serverName)) {
            return await interaction.reply({
                content: `No server matching name \`${serverName}\` found!`,
            });
        }

        const launchPath = path.join(path.dirname(__dirname), 'launch_scripts');

        await interaction.deferReply();
        launch_server(launch[serverName].port, launchPath, launch[serverName].script);

        async function launch_server(port, folder, script) {
            mcHermes({
                type: 'pc',
                server: 'localhost',
                port: port,
            })
                .catch(console.error)
                .then(async (data) => {
                    if (data) {
                        return await interaction.editReply({
                            content: `Server \`${serverName}\` already running!`,
                        });
                    }
                    exec(path.join(folder, script))
                        .then((async ({ stdout, stderr }) => {
                            console.log(`stdout: '${stdout}'`);
                            console.error(`stderr: '${stderr}'`);
                            await interaction.editReply({
                                content: `Starting \`${serverName}\` server...`,
                            });
                        }))
                        .catch(async (error) => {
                            console.error(error);
                            await interaction.editReply({
                                content: `Error while starting \`${serverName}\` server!`,
                            });
                        });
                });
        }
    },
    async autocomplete(interaction) {
        const focusedValue = interaction.options.getFocused();
        const choices = Object.keys(launch);
        const filtered = choices.filter(choice => choice.startsWith(focusedValue));
        await interaction.respond(
            filtered.map(choice => ({ name: choice, value: choice })),
        );
    },
};
