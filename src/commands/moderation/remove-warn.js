const { SlashCommandBuilder } = require('discord.js');
const Warn = require('../../models/warn');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn-remove')
    .setDescription('Remove a warn from a user')
    .addUserOption(option =>
      option.setName('target').setDescription('User to remove warn from').setRequired(true)
    ),

  async execute(interaction) {
    const targetUser = interaction.options.getUser('target');

    try {
      const warn = await Warn.findOneAndDelete({
        userId: targetUser.id,
        guildId: interaction.guild.id
      });

      if (!warn) {
        return interaction.reply(`${targetUser.tag} has no warns.`);
      }

      interaction.reply(`Successfully removed warn from ${targetUser.tag}`);
    } catch (error) {
      console.error('Error occurred while removing warn:', error);
      interaction.reply('An error occurred while removing the warn.');
    }
  }
};
