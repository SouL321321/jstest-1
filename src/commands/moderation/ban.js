const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

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
    const targetUser = interaction.options.getUser("target");
    const reason = interaction.options.getString("reason");

    if (!interaction.memberPermissions.has("BAN_MEMBERS")) {
      return interaction.reply(`No permissions for ban!`);
    }

    try {
      const targetMember = await interaction.guild.members.fetch(targetUser);

      await targetMember.ban({
        reason: reason || "No reason specified",
      });

      const banEmbed = new EmbedBuilder()
        .setTitle("User Banned")
        .setDescription(`Successfully banned ${targetUser} from the server.`)
        .setColor("DarkRed")
        .setThumbnail(target.displayAvatarURL({ dynamic: true }))
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
          { name: "Timestamp", value: new Date().toUTCString(), inline: true }
        );
      interaction.reply({ embeds: [banEmbed] });
    } catch (error) {
      console.error(`Error occurred while banning user: ${error}`);
      interaction.reply(`An error occurred while banning the user.`);
    }
  },
};
