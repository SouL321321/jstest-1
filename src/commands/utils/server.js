const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("server")
    .setDescription("Display server information📴"),

  async execute(interaction, client) {
    const guild = interaction.guild;
    const owner = await client.users.fetch(guild.ownerId);

    const embed = new EmbedBuilder()
      .setColor("#3498db")
      .setTitle("Server Information")
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .setDescription(`Here is some information about ${guild.name}:`)
      .addFields(
        { name: "Server Name", value: guild.name, inline: true },
        { name: "Server ID", value: guild.id, inline: true },
        { name: "Owner", value: owner.tag, inline: true },
        {
          name: "Member Count",
          value: guild.memberCount.toString(),
          inline: true,
        },
        {
          name: "Region",
          value: guild.region ? guild.region.toUpperCase() : "Unknown",
          inline: true,
        },
        {
          name: "Created At",
          value: guild.createdAt.toUTCString(),
          inline: true,
        }
      )
      .setFooter({
        text: `Requested by ${interaction.user.username}`,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
