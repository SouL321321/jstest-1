const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick a user")
    .addUserOption((option) =>
      option.setName("target").setDescription("User to kick").setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Reason for kick")
        .setRequired(false)
    ),

  async execute(interaction) {
    const target = interaction.options.getUser("target");
    const reason =
      interaction.options.getString("reason") || "No reason provided";

    if (!interaction.memberPermissions.has("KICK_MEMBERS")) {
      return interaction.reply(`You don't have permission to kick members!`);
    }

    try {
      await interaction.guild.members.kick(target, reason);

      const kickEmbed = new EmbedBuilder()
        .setTitle("User Kicked")
        .setDescription(`Successfully kicked ${target} from the server.`)
        .setColor("Blue")
        .addFields(
          {
            name: "Kicked by",
            value: interaction.user.toString(),
            inline: true,
          },
          { name: "Reason", value: reason, inline: true }
        )
        .setThumbnail(target.displayAvatarURL({ dynamic: true }))
        .setTimestamp();

      interaction.reply({ embeds: [kickEmbed] });
    } catch (error) {
      console.error(`An error occurred while kicking the user: ${error}`);
      interaction.reply(`An error occurred while kickin' the user.`);
    }
  },
};
