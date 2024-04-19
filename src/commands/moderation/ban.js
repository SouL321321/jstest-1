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
          { name: "User ID", value: `${targetUser.id}`, inline: true }
        );

      const message = await interaction.channel.send({ embeds: [banEmbed] });

      await message.react("📋");

      const filter = (reaction, user) => {
        return reaction.emoji.name === "📋" && user.id === interaction.user.id;
      };

      message
        .awaitReactions({ filter, max: 1, time: 60000, errors: ["time"] })
        .then((collected) => {
          const reaction = collected.first();

          if (reaction) {
            interaction.user.send({
              content: `${targetUser.id}`,
              ephemeral: false,
            });
          }
        })
        .catch(() => {
          console.log("No reaction after 60 seconds.");
        });
    } catch (error) {
      console.error(`Error occurred while banning user: ${error}`);
      interaction.reply(`An error occurred while banning the user.`);
    }
  },
};
