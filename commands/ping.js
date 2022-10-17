const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Prints the status of a Minecraft server'),
    async execute(interaction) {
        // À compléter
        await interaction.reply('Pong!');
    },
};