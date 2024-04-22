const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require("discord.js");
const TimeoutMember = require("../../models/TimeoutMember");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("timeout-check")
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

      const currentTime = new Date();
      const memberFields = [];
      const timeoutMemberSet = new Set();

      for (const timeoutMember of timeoutMembers) {
        if (currentTime > timeoutMember.timeoutEnd) {
          continue;
        }

        const guildMember = await interaction.guild.members.fetch(
          timeoutMember.memberId
        );
        if (guildMember && !timeoutMemberSet.has(guildMember.id)) {
          timeoutMemberSet.add(guildMember.id);

          const formattedDate = new Date(timeoutMember.timeoutEnd);
          const dateString = formattedDate.toLocaleDateString("en-GB", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
          });
          const timeString = formattedDate.toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
          });

          memberFields.push({
            name: guildMember.user.tag,
            value: `Timeout end: ${dateString} | ${timeString} (CET)`,
            inline: true,
          });
        }
      }

      const embed = new EmbedBuilder()
        .setColor("Grey")
        .setTitle("Timed Out Members")
        .setDescription("List of members currently timed out:")
        .addFields(memberFields);

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
