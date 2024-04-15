const { SlashCommandBuilder } = require("discord.js");
const Warn = require("../../models/warn");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Warn a user")
    .addUserOption((option) =>
      option.setName("target").setDescription("User to warn").setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Reason for warn")
        .setRequired(true)
    ),

  async execute(interaction) {
    const targetUser = interaction.options.getUser("target");
    const reason = interaction.options.getString("reason");

    try {
      const warn = new Warn({
        userId: targetUser.id,
        moderatorId: interaction.user.id,
        guildId: interaction.guild.id,
        reason: reason,
      });
      await warn.save();

      interaction.reply(`Successfully warned ${targetUser.tag} for: ${reason}`);
    } catch (error) {
      console.error("Error occurred while warning user:", error);
      interaction.reply("An error occurred while warning the user.");
    }
  },
};
