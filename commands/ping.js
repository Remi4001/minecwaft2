const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Prints the status of a Minecraft server'),
    async execute(interaction) {
        await interaction.reply('Pong!') // À compléter
    },
};