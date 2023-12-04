const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("user")
    .setDescription("👩User info!🧑"),
  async execute(interaction, client) {
    const user = interaction.user;
    const embed = {
      color: 0x3498db,
      title: `User Info for ${user.tag}`,
      thumbnail: {
        url: user.displayAvatarURL({ dynamic: true }),
      },
      fields: [
        {
          name: "Username |",
          value: user.username,
          inline: true,
        },
        {
          name: "\nUser ID |",
          value: user.id,
          inline: true,
        },
        {
          name: "\nDiscriminator |",
          value: user.discriminator,
          inline: true,
        },
        {
          name: "\nAccount Created",
          value: user.createdAt.toUTCString(),
          inline: true,
        },
      ],
      footer: {
        text: "User Info",
      },
    };

    await interaction.reply({
      content: "Details of your profile:",
      embeds: [embed],
    });
  },
};
