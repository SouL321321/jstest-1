const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");
const TimeoutMember = require("../../models/TimeoutMember");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("check-timeout")
    .setDescription("Check the list of timed out members."),
  async execute(interaction) {
    try {
      if (
        !interaction.member.permissions.has(
          PermissionsBitField.Flags.Administrator
        )
      ) {
        return interaction.reply({
          content: "You must be a moderator to view the timeout list.",
          ephemeral: true,
        });
      }
      const timeoutMembers = await TimeoutMember.find({
        guildId: interaction.guildId,
      });

      if (timeoutMembers.length === 0) {
        return interaction.reply({
          content: "No members are currently timed out.",
          ephemeral: true,
        });
      }

      const embed = new EmbedBuilder()
        .setColor("#808080")
        .setTitle("Timed Out Members")
        .setDescription("List of members currently timed out:")
        .addFields(
          timeoutMembers.map((member) => ({
            name: member.memberId,
            value: `Timeout end: ${member.timeoutEnd}`,
            inline: true,
          }))
        );

      interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (error) {
      console.error("Error fetching timeout members:", error);
      interaction.reply({
        content: "An error occurred while fetching timeout members.",
        ephemeral: true,
      });
    }
  },
};
