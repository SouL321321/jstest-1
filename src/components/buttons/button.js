const { SlashCommandBuilder, ActionRowBuilder, ButtonStyle, ButtonBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("discord-guru")
    .setDescription("Return server GuildGuru!"),
    async execute (interaction) {
    const  button = new ButtonBuilder()
    .setCustomId('ex-button')
    .setLabel(`Click me!`)
    .setStyle(ButtonStyle.Primary)

    await interaction.reply({
        components: [new ActionRowBuilder().addComponents(button)] 
    })
  },
};
