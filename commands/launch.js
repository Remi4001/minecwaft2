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
        .addStringOption(option => {
            option.setName('server')
                .setDescription('The server to launch')
                .addChoices(
                    launch_scripts(),
                );
        }),
    logUser: true,
    cooldown: 10000,
    async execute(interaction) {
        await interaction.deferReply();

        if (process.platform !== 'win32') {
            // TODO: Add Linux support
            return await interaction.editReply({
                content: 'Command disabled for OS different than Windows',
            });
        }

        const serverName = interaction.options.getString('server');
        const launchPath = path.join(path.dirname(__dirname), 'launch_scripts');
        launch_server(launch[serverName].port, launchPath, launch[serverName].script);

        async function launch_server(port, folder, bat) {
            mcHermes({
                type: 'pc',
                server: 'localhost',
                port: port,
            })
                .catch(console.error)
                .then(async (data) => {
                    if (data) {
                        return await interaction.editReply({
                            content: `Server ${serverName} already running!`,
                        });
                    } else {
                        exec(`start /D "${folder}" cmd /c "${bat}"`)
                            .then((async ({ stdout, stderr }) => {
                                console.log(`stdout: '${stdout}'`);
                                console.error(`stderr: '${stderr}'`);
                                await interaction.editReply({
                                    content: `Starting ${serverName} server...`,
                                });
                            }));
                    }
                });
        }
    },
};

function launch_scripts() {
    let choices = {};
    for (const name in launch) {
        choices += { name: name, value: name };
    }
    return choices;
}