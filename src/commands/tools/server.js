const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("server")
    .setDescription("Return info server!📝"),
    async execute (interaction, client) {
    const guild = interaction.guild;
    const owner = await client.users.fetch(guild.ownerId);
    const embedS = new EmbedBuilder()
      .setTitle("Server Information📝")
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .addFields([
        {
          name: "Server Name",
          value: guild.name,
        },
        {
          name: "Server ID",
          value: guild.id,
        },
        {
          name: "Owner",
          value: owner.username,
        },
        {
          name: "Member Count",
          value: guild.memberCount.toString(),
        },
        {
          name: "Created At",
          value: guild.createdAt.toUTCString(),
        },
      ])
      .setFooter({
        text: "This is the server!💜",
        iconURL: client.user.displayAvatarURL(),
      })
      .setColor(0x0b0000);

    await interaction.reply({
      content: "Details of the server:",
      embeds: [embedS],
    });
  },
};
