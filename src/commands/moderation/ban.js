const {
  SlashCommandBuilder,
  PermissionsBitField,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a user")
    .addUserOption((option) =>
      option.setName("target").setDescription("User to ban").setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Reason for ban")
        .setRequired(false)
    ),

  async execute(interaction) {
    if (
      !interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)
    ) {
      return interaction.reply({
        content: "You don't have permission to ban users.",
        ephemeral: true,
      });
    }

    const targetUser = interaction.options.getUser("target");
    const reason = interaction.options.getString("reason");

    try {
      const targetMember = await interaction.guild.members.fetch(targetUser);

      await targetMember.ban({
        reason: reason || "No reason specified",
      });

      const banEmbed = new EmbedBuilder()
        .setTitle("User Banned")
        .setDescription(
          `Successfully banned ${targetUser} (${targetUser.id}) from the server.`
        )
        .setColor("DarkRed")
        .setThumbnail(targetMember.displayAvatarURL({ dynamic: true }))
        .addFields(
          {
            name: "Banned by",
            value: interaction.user.toString(),
            inline: true,
          },
          {
            name: "Reason",
            value: reason || "No reason specified",
            inline: true,
          },
          { name: "Timestamp", value: new Date().toUTCString(), inline: true },
          {
            name: "User ID",
            value: `\`${targetUser.id}\` - [Click to copy](${targetUser.id})`,
            inline: true,
          }
        );

      interaction.reply({ embeds: [banEmbed] });
    } catch (error) {
      console.error(`Error occurred while banning user: ${error}`);
      interaction.reply(`An error occurred while banning the user.`);
    }
  },
};
