const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");
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
      await member.timeout(null);

      const deletedTimeoutMember = await TimeoutMember.findOneAndDelete({
        guildId: interaction.guildId,
        memberId: member.id,
      });

      if (!deletedTimeoutMember) {
        return interaction.reply({
          content: `${member.displayName} was not found in the timeout list.`,
          ephemeral: true,
        });
      }

      interaction.reply({
        content: `${member.displayName} has been removed from time-out.`,
        ephemeral: false,
      });
    } catch (error) {
      console.error("Error removing member from time-out:", error);
      interaction.reply({
        content: "An error occurred while removing member from time-out.",
        ephemeral: true,
      });
    }
  },
};
