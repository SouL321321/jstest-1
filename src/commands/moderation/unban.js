const {
  SlashCommandBuilder,
  PermissionsBitField,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Unban a user")
    .addStringOption((option) =>
      option
        .setName("target")
        .setDescription("Enter the user to unban (ID, username, or tag)")
        .setRequired(true)
    ),

  async execute(interaction) {
    if (
      !interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)
    ) {
      return interaction.reply({
        content: "You don't have permission to unban users.",
        ephemeral: true,
      });
    }

    const target = interaction.options.getString("target");

    try {
      const bannedUsers = await interaction.guild.bans.fetch();

      const bannedUser = bannedUsers.find((user) => {
        if (user.user.id === target) return true;
        if (user.user.username.toLowerCase() === target.toLowerCase())
          return true;
        if (user.user.tag === target) return true;
        return false;
      });

      if (!bannedUser) {
        return interaction.reply({
          content: "This user is not banned.",
          ephemeral: true,
        });
      }

      await interaction.guild.bans.remove(bannedUser.user.id);

      const unbanEmbed = new EmbedBuilder()
        .setTitle("User Unbanned")
        .setDescription(
          `Successfully unbanned ${bannedUser.user.tag} from the server.`
        )
        .setColor("#00ff00")
        .setThumbnail(bannedUser.user.displayAvatarURL({ dynamic: true }))
        .setFooter({
          text: `Unbanned by ${interaction.user.tag}`,
          iconURL: interaction.user.displayAvatarURL(),
        })
        .setTimestamp();

      interaction.reply({ embeds: [unbanEmbed] });
    } catch (error) {
      console.error(`An error occurred while unbanning the user: ${error}`);
      interaction.reply({
        content: "An error occurred while unbanning the user.",
        ephemeral: true,
      });
    }
  },
};
