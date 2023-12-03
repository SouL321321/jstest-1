const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("user")
    .setDescription("👩User info!🧑"),
  async execute(interaction, client) {
    const user = interaction.user;
    const embed = new EmbedBuilder()
      .setColor(0x8f00ff)
      .setTitle("💁‍♂️Username Info!💁‍♀️")
      .setDescription("This beautiful guy is u✨")
      .setImage(user.displayAvatarURL())
      .addFields([
        {
          name: `Username🔠`,
          value: user.username,
          inline: false,
        },
        {
          name: `User-ID🔢`,
          value: user.id,
          inline: false,
        },
      ])
      .setFooter({
        text: "This is your profile.",
        value: user.username,
        iconURL: client.user.displayAvatarURL(),
      });

    await interaction.reply({
      content: "Details of your profile:",
      embeds: [embed],
    });
  },
};
