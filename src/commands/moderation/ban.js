const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const KickBan = require("../../models/KickBan");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a user')
    .addUserOption(option =>
      option.setName('target').setDescription('User to ban').setRequired(true)
    )
    .addStringOption(option =>
      option.setName('reason').setDescription('Reason for ban').setRequired(false)
    ),

  async execute(interaction) {
    const targetUser = interaction.options.getUser('target');
    const reason = interaction.options.getString('reason');

    if (!interaction.memberPermissions.has('BAN_MEMBERS')) {
      return interaction.reply('You do not have permission to ban members.');
    }

    try {
      const targetMember = await interaction.guild.members.fetch(targetUser);
      await targetMember.ban({ reason });

      await KickBan.create({
        userId: targetUser.id,
        guildId: interaction.guild.id,
        action: 'ban',
        reason
      });

      interaction.reply(`Successfully banned ${targetUser.tag}.`);
    } catch (error) {
      console.error('Error occurred while banning user:', error);
      interaction.reply('An error occurred while banning the user.');
    }
  }
};