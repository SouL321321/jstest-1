const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  cooldown: 2.5,
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Return my ping!"),
    async execute (interaction) {
    const message = await interaction.deferReply({
      fetchReply: true,
    });

    const newMessage = `API Latency: ${interaction.client.ws.ping}\nClient ping: ${
      message.createdTimestamp - interaction.createdTimestamp
    }`;
    await interaction.editReply({
      content: newMessage,
    });
  },
};
