const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require("discord.js");
const TimeoutMember = require("../../models/TimeoutMember");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("timeout-remove")
    .setDescription("Remove the time-out for a member.")
    .addUserOption((option) =>
      option
        .setName("member")
        .setDescription("The member to remove from time-out.")
        .setRequired(true)
    ),
  async execute(interaction) {
    const member = interaction.options.getMember("member");

    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    ) {
      return interaction.reply({
        content:
          "You must be an administrator to remove members from time-out.",
        ephemeral: true,
      });
    }

    try {
      // Rimuovi il timeout dell'utente
      await member.timeout(null);

      // Rimuovi l'utente dal database dei timeout
      await TimeoutMember.findOneAndDelete({
        guildId: interaction.guildId,
        memberId: member.id,
      });

      const embed = new EmbedBuilder()
        .setColor("#00ff00")
        .setDescription(`${member.displayName} has been removed from time-out. ✅`)
        .toJSON();

      interaction.reply({ embeds: [embed], ephemeral: false });
    } catch (error) {
      console.error("Error removing member from time-out:", error);
      interaction.reply({
        content: "An error occurred while removing member from time-out.",
        ephemeral: true,
      });
    }
  },
};
